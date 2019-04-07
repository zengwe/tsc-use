import { anyTypeAnnotation } from "@babel/types";

interface IBaseTree {

}
interface ITree {
  // [key:string]: any
}
interface IParam {
  keyName: string|number;
  parentKeyName: string|number;
}
function createTree (result: any,arr: any[], param: IParam, callback?: (parent: any, child: any)=>void) {
  arr.forEach((ele, idx)=>{
    if(ele[param.parentKeyName] == result[param.keyName]) {
      let child = {
          [param.keyName]: ele[param.keyName],
          [param.parentKeyName]: result[param.keyName],
          data: ele,
          children: []        
      }
      result.children.push(child);
      if(callback!= undefined) callback(result, child);
      createTree (child,arr, param, callback);
    }
  });
}
function createTreeNormal(arr: any[], rootId: any = '', otherValue: {[key:string]: any}) {
  let result = {
    id: rootId,
    parentId: '',
    children: []
  }
  createTree(result, arr, {keyName: 'id', parentKeyName: 'parent'}, (parent, child) => {
    for(let key in otherValue) {
      child[key] = otherValue[key];
    }
  });
  return result.children;
}
export interface IResData<RelationData = (string | null), DataType = ({ [key: string]: any }|{})> {
  id: RelationData;
  parentId: RelationData | null;
  data: DataType | {} | undefined,
  parent: IResData | null;
  children: IResData[];
}
export function createTreeWithPrt<RelationDataType, AttachDataType>(arr: any[], rootId: any = '', attr: any, callback?: (parent: any, child: any) => void,) {
  let result: IResData<RelationDataType, AttachDataType> = {
      id: rootId,
      parentId: null,
      data: undefined,
      parent: null,
      children: []
  };
  Object.defineProperty(result, 'data', {
      value: {}
  });
  createTree(result, arr, { keyName: 'id', parentKeyName: 'parentId' }, (parent, child) => {
      child.parent = parent;
      for (let key in attr) {
          child[key] = attr[key];
          if (Object.prototype.toString.call(attr[key]) == '[object Function]') {
              child[key].bind(child);
          }
      }
      if (callback != undefined) callback(parent, child);
  });
  return result;
}
export function createTreeWithPrt2<RelationDataType, AttachDataType>(arr: any[], rootId: any = '', attr: any, callback?: (parent: any, child: any) => void) {
  let newCallback = () => {
    
  }
}
interface ISimpleTree {
  id: string | number,
  children: ISimpleTree[]
}
function traversalTree<T>(tree: ISimpleTree | ISimpleTree[], callback: (data:T)=>void) {
  if(Object.prototype.toString.call(tree) == '[object Object]') {
    callback(<any>tree);
  }else{
    (tree as ISimpleTree[]).forEach(ele => {});
  }
}
function treeToArr<T>(tree: ISimpleTree | ISimpleTree[]): T[] {
  let res: ISimpleTree[] = []; 
  traversalTree<ISimpleTree>(tree, (ele)=>{
    res.push(ele);
  });
  return <any>res;
}
let testData = [
  {
    id: 1,
    parentId: 0
  },
  {
    id: 2,
    parentId: 0
  },
  {
    id: 3,
    parentId: 1
  }
];
class dd {
  func() {
    let that = <any>this;
    console.log(that.id);
  }
}
let tree = createTreeWithPrt(testData, 0, new dd()) as any;
console.log(tree);
tree.children[0].func();
console.log('--------end----------')
// let res = {
//   id: 0,
//   parent: -1,
//   children: []
// }
// createTree(res, testData, {keyName: 'id', parentKeyName: 'parent', rootValue: -1});
// console.log(res)

