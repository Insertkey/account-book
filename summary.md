# 开发总结

## 浮点数计算

js中使用加减乘除计算浮点数，会有计算精度问题，可能会得到与预期不符的值。js没有浮点数计算相关的标准，我们可以使用第三方依赖 `decimal.js`

## 依赖版本锁定

锁定依赖的版本，包括修订版本。语义化版本可能得不到保证，比如依赖作者主观或者客观添加了不兼容的变更，却只修改了patch版本。锁定版本号可以避免供应链投毒，造成线上重大生产事故。也可以防止发布构建过程中，构建失败。依赖版本可以定期更新，测试，灰度发布，减少变更造成的影响。

## 组件拆分

降低代码数量作为组件拆分依据的权重。拆分组件时，应该着重考虑组件之间是否数据传递频繁，如果传递频繁还进行了组件拆分，组件之间的数据访问会造成很大的心智负担。

该应用中，可以拆分为表格展示组件，筛选条件组件，添加账单组件，因为这样拆分，组件间之间的数据访问较少。

如果组件代码还是很多，组件状态也很多，可以将状态提升到公共的service里面

## 使用本地数据
加载 `https://raw.githubusercontent.com/xmindltd/hiring/master/frontend-1/bill.csv` 的数据可能会出现异常，这时候可以使用本地数据。请求失败或超出一定时间时，使用本地数据。rxjs比较适合处理这样的逻辑
```ts
private getBillList() {
    return merge(
      this.accountBookService.getBillList().pipe(catchError(() => EMPTY)), // 获取账单列表的http请求，返回值类型是Observable<string>
      of(bill).pipe(delay(300))
    ).pipe(
      first(),
      map((res) => {
        const [, ...data] = res.split('\n');
        return data.map((item) => {
          const arr = item.split(',');
          return {
            type: arr[0],
            time: arr[1],
            category: arr[2],
            amount: arr[3],
          } as Bill;
        });
      })
    );
```

## 模拟月份选择器

`Angular Material` 没有月份选择器组件，我们可以实现以下两点，使用日期选择器模拟月份选择器：

1. 选中月份时，停止接下来日期的选择，直接关闭弹出层
2. 显示时，格式为 `YYYY-MM`

## 防御性编程
账单月份记录到了url的查询参数中。从查询参数初始化月份时，要校验值的有效性。可能用户在复制链接分享的过程中，出现参数错误，如果前端照单全收，可能会出现异常，造成应用崩溃。处理用户输入的情况下，着点尤为重要。
```ts
  private initStateFromQuery(): void {
    const { queryParamMap } = this.route.snapshot;
    const dateFormQuery = queryParamMap.get('date');
    if (dateFormQuery && moment(dateFormQuery).isValid()) {
      this.date = moment(dateFormQuery);
    }
    const categoryFormQuery = queryParamMap.get('category');
    if (categoryFormQuery) {
      this.category = categoryFormQuery;
    }
  }
```

## 接口实现分离
Angular中能够使用 `ngModel` 或者 `formControl` 的组件都是实现了 `ControlValueAccessor` 

项目中使用的账单类型下拉选择器，`Angular` 提供了默认实现:`SelectContorolValueAccessor`。我们在自定义组件中如果想使用Angular表单带来的好处，比如：`formControl` 中的 `valueChanges` 是 `Observable` 类型，可以实现 `ControlValueAccessor` 这个接口

## 组件行为与文档表现不符
pageSize选择下拉框样式异常。删除node_modules，重新安装解决问题

![pageSize选择下拉框样式异常](https://i.postimg.cc/HWbhXw9f/7-U9-PU-Z8-XG6-S-3-XXMED8.png)


## 发布构建失败
查看日志可知，node版本过低，升级到16.x解决问题

```
Error: Node.js version 12.x is deprecated. Deployments created on or after 2022-08-09 will fail to build. Please set Node.js Version to 16.x in your Project Settings to use Node.js 16. This change is the result of a decision made by an upstream infrastructure provider (AWS).
```
