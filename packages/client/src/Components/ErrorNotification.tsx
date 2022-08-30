import { notification } from "antd";
import React from "react";

export default function ErrorNotification(api: any, error: any) {
  console.log(error);
  const message: any = typeof error == "string" ? error : error.data.message;

  return api.error({
    message: `Error Notification`,
    description: <span>{message}</span>,
    placement: "bottomRight",
  });
}
