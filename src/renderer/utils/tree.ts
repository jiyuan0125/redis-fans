export interface TreeData {
  __paths__?: string[];
  __parentId__?: string;
  children?: TreeData[];
}

/**
 * 偏平化一个数据
 */
export const getFlatTree = (
  arr: TreeData[],
  result: object[] = [],
  parentProperty: string = 'id',
  pathPropertys: string[] = ['id'],
  perentValue: string | null = null,
  paths: string[] = []
) => {
  for (let item of arr) {
    // 复制一个item， 以免影响原来对象
    item = { ...item };
    // 添加 __paths__ 属性
    item.__paths__ = [];
    for (let i = 0; i < pathPropertys.length; i++) {
      if (paths[i]) {
        item.__paths__[i] = `${paths[i]}/${item[pathPropertys[i]]}`;
      } else {
        item.__paths__[i] = item[pathPropertys[i]];
      }
    }

    // 如查有参数里指定了父级属性，则添加__parentId__属性
    if (perentValue) {
      item.__parentId__ = perentValue;
    }

    // 添加当前的item到result
    result.push(item);

    // 如果当前的item有children属性，则递归添加子级的item到result
    if (item.children) {
      const children = item.children;
      // 清除 children
      delete item.children;
      // 递归处理
      getFlatTree(
        children,
        result,
        parentProperty,
        pathPropertys,
        item[parentProperty],
        item.__paths__
      );
    }
  }

  // return result;
};

/**
 * 得到指定path所有分段path
 * @private
 * @example
 * const result = getAllPathArray('/path1/path2/path3');
 * console.log(result); // ['/path1/path2/path3', '/path1/path2', '/path1']
 */
const getAllPathArray = (path: string, result: string[] = []): string[] => {
  const lastIndex = path.lastIndexOf('/');
  result.push(path);
  const remainPath = path.substring(0, lastIndex);
  if (remainPath) {
    return getAllPathArray(remainPath, result);
  }
  return result;
};

/**
 * 从树中过滤含有关键字的节点, 如果符合条件的树中节点含有子级，则所有子级对象也视为符合条件。所有符合条件父级也是符合条件的。
 *
 * 算法是这样：
 * - 先把具有层次关系的树扁平化，并在扁平化的数组元素里添加额外的属性: __parentId__， __paths__， 这一步通过getFlatTree方法完成
 * - 在 __paths__ 里查找指定的关键字，如果命中，把符合条件的所对象添加到临时的数组里
 * - 把数组里的对象关联起来，通过让父级含有一个chilren属性，子组元素指定 __parentId__ 属性
 * - 过滤上一步临时数组，只取出不含有 __parentId__ 的元素作为结果，意为只取出顶级元素。因为所有符合条件的结果已存在顶级对象的chilren属性和子级的children属性里
 *
 */
export const searchInTree = (
  arr: TreeData[],
  keyword: string,
  idProperty: string,
  pathPropertys: string[]
) => {
  // // 构造一个filter函数，用于过滤path
  // const pathFilter = keyword => path => path.indexOf(keyword) !== -1;
  // 把具有层级关系的树转成扁平树
  const flatTree: TreeData[] = [];
  getFlatTree(arr, flatTree, idProperty, pathPropertys);
  // console.log(flatTree)
  // 使用filter函数得到所有符合条件的path数组(string[])
  const pathArrays = flatTree.map((item) => item.__paths__);
  const filteredPathArray: string[] = [];
  for (let i = 0; i < pathPropertys.length; i++) {
    for (const pathArray of pathArrays) {
      if (pathArray) {
        if (pathArray[i].indexOf(keyword) !== -1) {
          filteredPathArray.push(pathArray[i]);
        }
      }
    }
  }

  // 构建一个Set，用来排除重复项
  const pathSet = new Set();
  filteredPathArray.forEach((path) => {
    const allPathArray = getAllPathArray(path);
    allPathArray.forEach((path) => {
      pathSet.add(path);
    });
  });

  // 构建一个Set，含有所有符合条件的元素，及其所有父级和子级
  const hittedSet = new Set();
  const pathArray = Array.from(pathSet);
  pathArray.forEach((path) => {
    const hitted = flatTree.find((item) => {
      for (const pathOfItem of item.__paths__!) {
        if (pathOfItem === path) {
          return item;
        }
      }
      return false;
    });

    hittedSet.add(hitted);
  });

  // 从 Set 转为数组
  const hittedArray = Array.from(hittedSet) as TreeData[];

  // 整理符合条件的对象，并使这些对象关联起来，形成层级关系
  hittedArray.forEach((item) => {
    const parentId = item.__parentId__!;
    if (!parentId) {
      return;
    }
    const parentItem = hittedArray.find(
      (item) => item[idProperty] === parentId
    );
    if (parentItem) {
      if (!parentItem.children) {
        parentItem.children = [];
      }
      parentItem.children.push(item);
    }
  });

  // 只取顶级对象，因为所有符合条件的结果已存在其chilren属性和子级的children属性里
  return hittedArray.filter((item) => !item.__parentId__);
};
