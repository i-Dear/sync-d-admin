import { Button, Form, Input, InputNumber, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const { Option } = Select;

interface ProjectCreateProps {
  project?: any;
  onFinish: () => void;
  onClose: () => void;
}

const ProjectCreate: React.FC<ProjectCreateProps> = ({ project, onFinish, onClose }) => {
  const [form] = useForm();
  const { data: session } = useSession();
  const [userOptions, setUserOptions] = useState<any[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!session) {
        console.error("세션이 없습니다.");
        return;
      }
      const token = session.user.token;
      try {
        const response = await fetch("https://syncd-backend.dev.i-dear.org/admin/user", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          if (userData.userEntities) {
            setUserOptions(
              userData.userEntities.map((user: any) => ({
                label: `${user.name} (${user.email})`,
                value: user.id,
              }))
            );
          }
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchUsers();
  }, [session]);

  useEffect(() => {
    if (project) {
      form.setFieldsValue({
        ...project,
        users: project.users.map((user: any) => user.userId),
      });
      setFileList(project.img ? [{ url: project.img }] : []);
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [project, form]);

  const handleFinish = useCallback(
    async (formValues: any) => {
      if (!session) {
        console.error("세션이 없습니다.");
        return;
      }
      const token = session.user.token;
      const url = project
        ? "https://syncd-backend.dev.i-dear.org/admin/project/update"
        : "https://syncd-backend.dev.i-dear.org/admin/project/create";
      const formData = new FormData();
      formData.append("name", formValues.name);
      formData.append("description", formValues.description);
      formData.append("progress", formValues.progress.toString());
      formData.append("leftChanceForUserstory", formValues.leftChanceForUserstory.toString());

      if (formValues.users && formValues.users.length > 0) {
        formData.append(
          "usersJson",
          JSON.stringify(formValues.users.map((userId: string) => ({ userId, role: "member" })))
        );
      } else {
        formData.append("usersJson", JSON.stringify([]));
      }

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("img", fileList[0].originFileObj);
        console.log("Appending image file:", fileList[0].originFileObj);
      } else {
        console.log("No image file to append");
      }

      if (project) {
        formData.append("projectId", project.id);
      }

      // 디버깅을 위한 코드: FormData 내용을 확인
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          onFinish();
          onClose();
        } else {
          const errorText = await response.text();
          console.error("Failed to submit project", errorText);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    },
    [project, fileList, onFinish, onClose, session]
  );

  const uploadProps = {
    accept: "image/*",
    fileList,
    beforeUpload: (file: any) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      return false;
    },
    onChange: (info: any) => {
      const fileList = info.fileList.slice(-1); // 최신 파일 하나만 유지
      setFileList(fileList);
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  return (
    <Form form={form} onFinish={handleFinish} layout="vertical">
      <Form.Item name="name" label="이름" rules={[{ required: true, message: "Please input the name!" }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="상세설명"
        rules={[{ required: true, message: "Please input the description!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="img" label="이미지">
        <Upload {...uploadProps} listType="picture">
          <Button icon={<UploadOutlined />}>이미지 업로드</Button>
        </Upload>
      </Form.Item>
      <Form.Item name="users" label="사용자들" rules={[{ required: false, message: "Please add users!" }]}>
        <Select mode="multiple" placeholder="Add user IDs and roles" options={userOptions} />
      </Form.Item>
      <Form.Item name="progress" label="진척도" rules={[{ required: true, message: "Please input the progress!" }]}>
        <InputNumber min={0} max={100} />
      </Form.Item>
      <Form.Item
        name="leftChanceForUserstory"
        label="남은 유저스토리 생성 횟수"
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
