import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Tag, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  ModalForm,
  ProFormText,
  ProFormInstance,
  ProFormRadio,
  ProFormDigit,
  ProFormSelect,
  ProFormMoney,
} from '@ant-design/pro-form';
// import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
// import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
// import UpdateForm from './components/UpdateForm';
import { rule, addRule, updateRule, removeRule } from './service';
import type { TableListItem1, TableListPagination } from './data';
/**
 * 添加节点
 *
 * @param fields
 */

const handleAdd = async (fields: Omit<TableListItem1, 'id' | 'showTime'>) => {
  const hide = message.loading('正在添加');

  try {
    await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields: FormValueType, currentRow?: TableListItem1) => {
  const hide = message.loading('正在配置');

  try {
    await updateRule({
      ...currentRow,
      ...fields,
    } as TableListItem1);
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};
/**
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRow: TableListItem1) => {
  const hide = message.loading('正在删除');

  try {
    await removeRule(selectedRow);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [currentRecord, setCurrentRecord] = useState<TableListItem1 | null>(null);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */

  const actionRef = useRef<ActionType>();
  const modalFormRef = useRef<ProFormInstance>();
  const tierRef = useRef({
    all: { color: 'success', text: '全段' },
    middle: { color: 'processing', text: '中段' },
    middleUp: { color: 'green', text: '中上段' },
    middleDown: { color: 'blue', text: '中下段' },
  });
  /** 国际化配置 */

  const columns: ProColumns<TableListItem1>[] = [
    {
      title: '品名',
      dataIndex: 'wine',
      copyable: true,
    },
    {
      title: '香型',
      dataIndex: 'wineType',
      valueEnum: {
        Fragrance: {
          text: '清香型',
        },
        strongAroma: {
          text: '浓香型',
        },
        sauceAroma: {
          text: '酱香',
        },
      },
    },
    {
      title: '段位',
      dataIndex: 'tier',
      render: (_, record) => {
        if (!record.tier) return null;
        return (
          <Tag color={tierRef.current[record.tier].color}>{tierRef.current[record.tier].text}</Tag>
        );
      },
    },
    {
      title: '酒龄',
      dataIndex: 'wineAge',
      renderText: (val: string) => (val ? `${val}年` : null),
    },
    {
      title: '酒精度',
      dataIndex: 'alcoholicStrength',
      renderText: (val: string) => (val ? `${val}%` : null),
    },
    {
      title: '单位',
      dataIndex: 'unit',
      valueEnum: {
        jin: {
          text: '斤',
        },
        kilogram: {
          text: '公斤',
        },
        piece: {
          text: '件',
        },
        pot: {
          text: '坛',
        },
      },
    },
    {
      title: '成本单价',
      dataIndex: 'costPrice',
      renderText: (val: string) => (val ? `${val}元` : null),
    },
    {
      title: '销售单价',
      dataIndex: 'salePrice',
      renderText: (val: string) => (val ? `${val}元` : null),
    },
    {
      title: '上架时间',
      dataIndex: 'showTime',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record: TableListItem1) => [
        <a
          key="update"
          onClick={() => {
            handleModalVisible(true);
            const { id, showTime, ...data } = record;
            setCurrentRecord(record);
            modalFormRef?.current?.setFieldsValue(data);
          }}
        >
          修改
        </a>,
        <a
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: `确定是否删除${record.wine}`,
              okText: '确定',
              cancelText: '取消',
              onOk: async () => {
                const success = await handleRemove(record);
                if (success && actionRef.current) {
                  actionRef.current.reload();
                }
              },
            });
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem1, TableListPagination>
        headerTitle="酒品信息"
        actionRef={actionRef}
        rowKey="id"
        dateFormatter="string"
        search={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCurrentRecord(null);
              handleModalVisible(true);
              modalFormRef?.current?.resetFields();
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={rule}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
      <ModalForm
        title={currentRecord ? '修改酒品' : '新增酒品'}
        width="800px"
        layout="horizontal"
        labelCol={{ span: 4 }}
        formRef={modalFormRef}
        wrapperCol={{ span: 14 }}
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          console.log(value);
          let success = false;
          if (currentRecord) {
            success = await handleUpdate(value, currentRecord);
          } else {
            success = await handleAdd(value);
          }
          if (success) {
            setCurrentRecord(null);
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '酒品名称为必填项',
            },
          ]}
          label="酒品名"
          name="wine"
          placeholder="酒品名必填"
        />
        <ProFormRadio.Group
          label="香型"
          radioType="button"
          name="wineType"
          options={[
            {
              value: 'Fragrance',
              label: '清香型',
            },
            {
              value: 'strongAroma',
              label: '浓香型',
            },
            {
              value: 'sauceAroma',
              label: '酱香型',
            },
          ]}
        />
        <ProFormRadio.Group
          label="段位"
          radioType="button"
          name="tier"
          options={[
            {
              value: 'all',
              label: '全段',
            },
            {
              value: 'middle',
              label: '中段',
            },
            {
              value: 'middleUp',
              label: '中上段',
            },
            {
              value: 'middleDown',
              label: '中下段',
            },
          ]}
        />
        <ProFormDigit name="wineAge" label="酒龄" />
        <ProFormDigit name="alcoholicStrength" label="酒精度" />
        <ProFormSelect
          options={[
            {
              value: 'jin',
              label: '斤',
            },
            {
              value: 'kilogram',
              label: '公斤',
            },
            {
              value: 'piece',
              label: '件',
            },
            {
              value: 'pot',
              label: '坛',
            },
          ]}
          name="unit"
          label="商品单位"
        />
        <ProFormMoney
          rules={[
            {
              required: true,
              message: '成本单价为必填项',
            },
          ]}
          label="成本单价"
          placeholder="成本单价必填"
          name="costPrice"
        />
        <ProFormMoney
          rules={[
            {
              required: true,
              message: '销售单价为必填项',
            },
          ]}
          label="销售单价"
          placeholder="销售单价必填"
          name="salePrice"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;
