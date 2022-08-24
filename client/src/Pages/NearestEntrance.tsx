import { Button, Form, Input, InputNumber, notification, Popconfirm, Table, Typography } from "antd";
import { Item } from "rc-menu";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { isArray } from "util";
import { EditableCell } from "../Components/EditableCell";
import ErrorNotification from "../Components/ErrorNotification";
import { api } from "../utils/api";
import { IsArrayUnique } from "../utils/IsArrayUnique";

interface Item {
  id: string;
  key: string;
  name: string;
  parking_slot: string | any;
}
const endpoint = "nearest-entrance";
export default function NearestEntrance() {
  const [data, setData]: any = useState([]);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record: Item) => record.key === editingKey;
  const [context, contextHolder] = notification.useNotification();
  const DisabledLink = styled.a(() => {
    if (editingKey !== "")
      return { color: "rgba(0,0,0,.25)", cursor: "not-allowed", ":hover": { color: "rgba(0,0,0,.25)" } };
  });
  useEffect(() => {
    const getNerestEntrance = async () => {
      const entrance = await api.get(endpoint);

      setData(entrance.map((item: Item) => ({ ...item, key: item.id })));
    };
    getNerestEntrance();
  }, []);

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ name: "", parking_slot: "", ...record });
    setEditingKey(record.key);
  };

  const cancel = (_: any) => {
    setEditingKey("");
    if (!_.id) {
      const newData = data.filter((i: any) => i.key !== _.key);
      setData(newData);
    }
  };

  const deleteItem = async (item: Item) => {
    const newData = data.filter((i: any) => i.key !== item.key);
    setData(newData);
    await api.delete(`${endpoint}/${item.id}`);
  };

  const handleAdd = () => {
    const key = (Math.random() * 1000).toString();
    const newData: Item = {
      id: "",
      key: key,
      name: "",
      parking_slot: [0],
    };
    setData([...data, newData]);
    form.setFieldsValue({ name: "", parking_slot: "", ...data });
    setEditingKey(key);
  };
  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        if (typeof row.parking_slot == "string") {
          let newArr: Array<number> = [];
          const parking_slot = row.parking_slot.split(",");
          for (let i = 0; i < parking_slot.length; i++) {
            const element: any = parking_slot[i];
            if (isNaN(element)) {
              return ErrorNotification(context, "Parking Slot Must Be a Collection of  Numbers");
            }
            newArr.push(parseInt(element, 10));
          }

          row.parking_slot = newArr;
        }

        if (!IsArrayUnique(row.parking_slot)) {
          return ErrorNotification(context, "Duplicate value of Parking slots");
        }

        if (newData[index].id !== "") {
          await api.patch(`${endpoint}/${newData[index].id}`, row);
        } else {
          await api.post(`${endpoint}`, row);
        }
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "name",
      dataIndex: "name",
      editable: true,
    },
    {
      title: "Parking Slots",
      dataIndex: "parking_slot",
      editable: true,
      render: (_: any, record: Item) => record.parking_slot.toString(),
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={() => cancel(record)}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link disabled={editingKey !== ""} onClick={() => edit(record)} style={{ marginRight: 8 }}>
              Edit
            </Typography.Link>
            <Popconfirm
              disabled={editingKey !== ""}
              title={`Sure to delete Entrance ${record.name}?`}
              onConfirm={() => deleteItem(record)}
            >
              <DisabledLink>Delete</DisabledLink>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      {contextHolder}
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add a row
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={false}
        />
      </Form>
    </>
  );
}
