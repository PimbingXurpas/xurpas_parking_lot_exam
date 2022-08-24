import { Button, DatePicker, Form, notification, Popconfirm, Table, Typography } from "antd";
import { StatSyncFn } from "fs";
import moment from "moment";
import { Item } from "rc-menu";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { EditableCell } from "../../Components/EditableCell";
import ErrorNotification from "../../Components/ErrorNotification";
import { api } from "../../utils/api";
import { VEHICLE_SIZE } from "../../utils/vechicleSize";
import { TicketModal } from "./TicketModal";

interface IparkingSlot {
  id: string;
  slot_size: string;
  status: string;
}
interface Item {
  id: number;
  key: string;
  plate_number: VEHICLE_SIZE;
  bill: string;
  parkingSlot: IparkingSlot;
  time_in: Date;
  time_out: Date | null;
}
const dateFormat = "YYYY-MM-DD hh:mm A";
const endpoint = "ticket";
export default function Ticket() {
  const [data, setData]: any = useState();
  const [form] = Form.useForm();

  const [visible, setVisible] = useState(false);
  const [context, contextHolder] = notification.useNotification();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record: Item) => record.key === editingKey;
  const DisabledLink = styled.a(() => {
    if (editingKey !== "")
      return { color: "rgba(0,0,0,.25)", cursor: "not-allowed", ":hover": { color: "rgba(0,0,0,.25)" } };
  });
  const onCreate = async (values: any) => {
    try {
      const timeIn = values["timeIn"].format(dateFormat);
      const newData = await api.post(endpoint, { ...values, time_in: timeIn });
      const key = (Math.random() * 1000).toString();
      const item: Item = {
        id: newData.data.id,
        key: key,
        plate_number: newData.data.plate_number,
        bill: newData.data.bill,
        parkingSlot: newData.data.parkingSlot,
        time_in: timeIn,
        time_out: null,
      };

      setData([...data, item]);
      setVisible(false);
    } catch (error: any) {
      ErrorNotification(context, error);
    }
  };
  const showModal = () => {
    setVisible(true);
  };

  useEffect(() => {
    const getNerestEntrance = async () => {
      const ticket = await api.get(endpoint);
      setData(ticket.map((item: Item) => ({ ...item, key: item.id })));
    };
    getNerestEntrance();
  }, []);

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

        if (newData[index].id !== "") {
          const patch = await api.patch(`${endpoint}/${newData[index].id}`, row);
          newData[index].bill = patch.data.bill;
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
    } catch (error) {
      setEditingKey("");
      ErrorNotification(context, error);
    }
  };
  const cancel = (_: any) => {
    setEditingKey("");
    if (!_.id) {
      const newData = data.filter((i: any) => i.key !== _.key);
      setData(newData);
    }
  };
  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({
      ...record,
      time_in: moment(record.time_in).format(dateFormat),
      time_out: record.time_out ? moment(record.time_out).format(dateFormat) : "",
    });

    setEditingKey(record.key);
  };
  const deleteItem = async (item: Item) => {
    const newData = data.filter((i: any) => i.key !== item.key);
    setData(newData);
    await api.delete(`${endpoint}/${item.id}`);
  };

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      editable: true,
    },
    {
      title: "Plate Number",
      dataIndex: "plate_number",
      editable: true,
    },
    {
      title: "Bill",
      dataIndex: "bill",
      editable: false,
    },
    {
      title: "Parking Slot",
      dataIndex: "parkingSlot",
      editable: false,
      render: (item: IparkingSlot, record: any) => item.id,
    },
    {
      title: "Parking Slot Size",
      dataIndex: "parkingSlot",
      editable: false,
      render: (item: IparkingSlot, record: any) => item.slot_size,
    },
    {
      title: "Time In",
      dataIndex: "time_in",
      editable: true,
      render: (item: Date, record: any) => moment(item).format(dateFormat),
    },

    {
      title: "Time Out",
      dataIndex: "time_out",
      editable: true,
      render: (item: Date, record: any) => (item ? moment(item).format(dateFormat) : ""),
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
          <>
            <Typography.Link
              disabled={record.time_out !== null}
              onClick={() => edit(record)}
              style={{ marginRight: 8 }}
            >
              Edit
            </Typography.Link>
            <Popconfirm
              disabled={editingKey !== ""}
              title={`Sure to delete Ticket ${record.id}?`}
              onConfirm={() => deleteItem(record)}
            >
              <DisabledLink>Delete</DisabledLink>
            </Popconfirm>
          </>
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
        inputType: col.dataIndex === "time_in" || "time_out" ? "date" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      {contextHolder}
      <Button onClick={showModal} type="primary" style={{ marginBottom: 16 }}>
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
      <TicketModal
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </>
  );
}
