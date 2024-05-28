import { Button, Form, Input, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useCallback, useEffect } from "react";

const { Option } = Select;

interface UserCreateProps {
  user?: any;
  onFinish: () => void;
  onClose: () => void;
}

const UserCreate: React.FC<UserCreateProps> = ({ user, onFinish, onClose }) => {
  const [form] = useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
  }, [user, form]);

  const handleFinish = useCallback(
    async (formValues: any) => {
      try {
        const url = user ? "http://localhost:8080/admin/user/update" : "http://localhost:8080/admin/user/create";
        const method = "POST";
        const payload = user ? { ...formValues, userId: user.id } : formValues;

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          onFinish();
          onClose();
        } else {
          console.error("Failed to submit user");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    },
    [user, onFinish, onClose]
  );

  return (
    <Form form={form} onFinish={handleFinish} layout="vertical">
      <Form.Item name="email" label="Email" rules={[{ required: true, message: "Please input the email!" }]}>
        <Input />
      </Form.Item>
      <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please input the name!" }]}>
        <Input />
      </Form.Item>
      <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select the status!" }]}>
        <Select>
          <Option value="available">Available</Option>
          <Option value="unavailable">Unavailable</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="profileImg"
        label="Profile Image"
        rules={[{ required: true, message: "Please input the profile image!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="projectIds" label="Project IDs">
        <Input />
      </Form.Item>
      <Form.Item>
        <div style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit">
            {user ? "유저 수정" : "유저 생성"}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default UserCreate;
