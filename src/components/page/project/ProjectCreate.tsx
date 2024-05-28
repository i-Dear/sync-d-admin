import { Button, Form, Input, InputNumber, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

const { Option } = Select;

interface ProjectCreateProps {
  project?: any;
  onFinish: () => void;
  onClose: () => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ProjectCreate: React.FC<ProjectCreateProps> = ({ project, onFinish, onClose }) => {
  const [form] = useForm();
  const { data: userData, error: userError } = useSWR("http://localhost:8080/admin/user", fetcher);
  const [userOptions, setUserOptions] = useState<any[]>([]);

  useEffect(() => {
    if (userData) {
      setUserOptions(
        userData.userEntities.map((user: any) => ({
          label: `${user.name} (${user.email})`,
          value: user.id,
        }))
      );
    }
  }, [userData]);

  useEffect(() => {
    if (project) {
      form.setFieldsValue({
        ...project,
        users: project.users.map((user: any) => user.userId),
      });
    } else {
      form.resetFields();
    }
  }, [project, form]);

  const handleFinish = useCallback(
    async (formValues: any) => {
      try {
        const url = project
          ? "http://localhost:8080/admin/project/update"
          : "http://localhost:8080/admin/project/create";
        const method = "POST";
        const payload = {
          ...formValues,
          users: formValues.users.map((userId: string) => ({ userId, role: "member" })),
        };
        if (project) {
          payload.projectId = project.id;
        }

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
          console.error("Failed to submit project");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    },
    [project, onFinish, onClose]
  );

  return (
    <Form form={form} onFinish={handleFinish} layout="vertical">
      <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please input the name!" }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: "Please input the description!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="img" label="Image (Base64)" rules={[{ required: true, message: "Please input the image!" }]}>
        <Input />
      </Form.Item>
      <Form.Item name="users" label="Users" rules={[{ required: true, message: "Please add users!" }]}>
        <Select mode="multiple" placeholder="Add user IDs and roles" options={userOptions} />
      </Form.Item>
      <Form.Item name="progress" label="Progress" rules={[{ required: true, message: "Please input the progress!" }]}>
        <InputNumber min={0} max={100} />
      </Form.Item>
      <Form.Item
        name="leftChanceForUserstory"
        label="Left Chance for Userstory"
        rules={[{ required: true, message: "Please input the left chance for userstory!" }]}
      >
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item>
        <div style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit">
            {project ? "프로젝트 수정" : "프로젝트 생성"}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default ProjectCreate;
