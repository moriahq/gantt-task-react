import React, { useEffect, useContext, useMemo } from "react";
import { Modal, Form, Select } from "antd";
import { GanttConfigContext } from "../../contsxt";
import { TimeItemProps } from "./time";
import styles from "./index.module.css";
const { Option } = Select;
const filterOption = (input: any, option: any) => {
  return option?.children?.toLowerCase().indexOf(input?.toLowerCase()) > -1;
};

interface ItemModalProps {
  visible: boolean;
  handleCancel: () => void;
  handleOk: (values: any) => void;
  currentItem: TimeItemProps;
  timeList?: TimeItemProps[];
}
const ItemModal: React.FC<ItemModalProps> = ({
  visible,
  handleCancel,
  handleOk,
  currentItem,
  timeList,
}) => {
  const [form] = Form.useForm();
  const { itemTypeData } = useContext(GanttConfigContext);
  const { customeFieldData } = useContext(GanttConfigContext);
  // 筛选字段类型为日期和数值的字段
  const filterFields = (type: string) => {
    const res = useMemo(() => {
      return customeFieldData.filter((ele: any) => {
        return ele?.fieldType?.key === type;
      });
    }, [customeFieldData]);
    return res;
  };
  useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue({
        ...currentItem,
      });
    }
  }, [visible, currentItem]);

  const handleConfirm = () => {
    form
      .validateFields()
      .then(values => {
        handleOk(values);
      })
      .catch(info => {
        console.log("Validate Failed:", info);
      });
  };
  const itemCheck = (_: any, value: any) => {
    if (value) {
      const itemFilter = timeList?.filter(item => item.itemType === value);
      if (itemFilter?.length && currentItem.itemType !== value) {
        return Promise.reject(new Error("该卡片类型已选择， 请重新选择"));
      }
      return Promise.resolve();
    } else {
      return Promise.resolve();
    }
  };
  return (
    <Modal
      title="时间字段配置"
      visible={visible}
      onOk={handleConfirm}
      onCancel={handleCancel}
      cancelText="取消"
      okText="确定"
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout="vertical"
      >
        {!currentItem?.isDefault && (
          <Form.Item
            label="卡片类型"
            name="itemType"
            rules={[
              { required: true, message: "请选择卡片类型" },
              {
                validator: itemCheck,
              },
            ]}
          >
            <Select placeholder="请选择" allowClear>
              {itemTypeData.map((ele: any) => {
                return (
                  <Option value={ele.value} key={ele.value}>
                    {ele.icon ? (
                      <img src={ele.icon} className={styles.icon} />
                    ) : null}
                    {ele.label}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          label="开始日期"
          name="startDate"
          rules={[{ required: true, message: "请选择开始日期字段" }]}
        >
          {/* 代码没有抽离，原因是会影响from的校验触发 */}
          <Select
            placeholder="请选择"
            showSearch
            filterOption={filterOption}
            allowClear
          >
            {filterFields("Date").map((ele: any) => {
              return (
                <Option value={ele.value} key={ele.value}>
                  {ele.label}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="结束日期"
          name="endDate"
          rules={[{ required: true, message: "请选择结束日期字段" }]}
        >
          <Select
            placeholder="请选择"
            allowClear
            showSearch
            filterOption={filterOption}
          >
            {filterFields("Date").map((ele: any) => {
              return (
                <Option value={ele.value} key={ele.value}>
                  {ele.label}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="基线开始日期" name="baseLineStartDate">
          <Select
            placeholder="请选择"
            allowClear
            showSearch
            filterOption={filterOption}
          >
            {filterFields("Date").map((ele: any) => {
              return (
                <Option value={ele.value} key={ele.value}>
                  {ele.label}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="基线结束日期" name="baseLineEndDate">
          <Select
            placeholder="请选择"
            allowClear
            showSearch
            filterOption={filterOption}
          >
            {filterFields("Date").map((ele: any) => {
              return (
                <Option value={ele.value} key={ele.value}>
                  {ele.label}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="完成占比" name="percentage">
          <Select
            placeholder="请选择"
            allowClear
            showSearch
            filterOption={filterOption}
          >
            {filterFields("Number").map((ele: any) => {
              return (
                <Option value={ele.value} key={ele.value}>
                  {ele.label}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ItemModal;
