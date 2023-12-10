// @ts-ignore
/* eslint-disable */
// import { request } from 'umi';
import { TableListItem, TableListItem1 } from './data';

// /** 获取规则列表 GET /api/rule */
// export async function rule(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     /** 页面的容量 */
//     pageSize?: number;
//   },
//   options?: { [key: string]: any },
// ) {
//   return request<{
//     data: TableListItem[];
//     /** 列表的内容总数 */
//     total?: number;
//     success?: boolean;
//   }>('/api/rule', {
//     method: 'GET',
//     params: {
//       ...params,
//     },
//     ...(options || {}),
//   });
// }

const genList = (current: number, pageSize: number) => {
  const tableListDataSource: TableListItem1[] = [];

  // for (let i = 0; i < pageSize; i += 1) {
  //   const index = (current - 1) * 10 + i;
  //   tableListDataSource.push({
  //     id: index,
  //     wine: `大灶包谷酒-${index + 1}`,
  //     wineType: ["Fragrance", "strongAroma", "sauceAroma"][Math.floor(Math.random() * 10) % 3] as any,
  //     tier: ["all", "middle", "middleUp", "middleDown"][Math.floor(Math.random() * 10) % 4] as any,
  //     wineAge: Math.ceil(Math.random() * 10),
  //     alcoholicStrength: Math.floor(Math.random() * 100),
  //     unit: ["jin", "kilogram", "piece", "pot"][Math.floor(Math.random() * 10) % 4] as any,
  //     costPrice: Math.ceil(Math.random() * 100),
  //     salePrice: Math.ceil(Math.random() * 100),
  //     showTime: new Date()
  //   });
  // }
  // tableListDataSource.reverse();
  return tableListDataSource;
};

let tableListDataSource = genList(1, 100);

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return new Promise<{
    data: TableListItem1[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>((resolve, reject) => {
    setTimeout(() => {
      const { pageSize = 20, current = 1 } = params;
      const start = pageSize * (current - 1);
      const end = pageSize * current;
      const data = tableListDataSource.slice(start, end);
      resolve({
        data,
        success: true,
        total: tableListDataSource.length,
      });
    }, 1000);
  });
}

/** 新建规则 PUT /api/rule */
// export async function updateRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
//   return request<TableListItem>('/api/rule', {
//     data,
//     method: 'PUT',
//     ...(options || {}),
//   });
// }
export async function updateRule(data: TableListItem1, options?: { [key: string]: any }) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      const id = data.id;
      const index = tableListDataSource.findIndex((item) => item.id === id);
      tableListDataSource[index] = data;
      resolve();
    }, 1000);
  });
}

/** 新建规则 POST /api/rule */
// export async function addRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
//   return request<TableListItem>('/api/rule', {
//     data,
//     method: 'POST',
//     ...(options || {}),
//   });
// }

export async function addRule(
  data: Omit<TableListItem1, 'id' | 'showTime'>,
  options?: { [key: string]: any },
) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      const id = tableListDataSource.length + 1;
      tableListDataSource.unshift({
        id,
        ...data,
        showTime: new Date(),
      });
      resolve();
    }, 1000);
  });
}

/** 删除规则 DELETE /api/rule */
// export async function removeRule(data: { key: number[] }, options?: { [key: string]: any }) {
//   return request<Record<string, any>>('/api/rule', {
//     data,
//     method: 'DELETE',
//     ...(options || {}),
//   });
// }

export async function removeRule(data: TableListItem1, options?: { [key: string]: any }) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      const { id } = data;
      const index = tableListDataSource.findIndex((item) => item.id === id);
      tableListDataSource.splice(index, 1);
      resolve();
    }, 1000);
  });
}
