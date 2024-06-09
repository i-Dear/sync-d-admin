import { Button, Form, Input, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const { Option } = Select;

interface UserCreateProps {
  user?: any;
  onFinish: () => void;
  onClose: () => void;
}

const UserCreate: React.FC<UserCreateProps> = ({ user, onFinish, onClose }) => {
  const [form] = useForm();
  const { data: session } = useSession();
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    console.log("Received user object:", user); // user 객체 확인
    if (user) {
      form.setFieldsValue(user.user); // user.user 객체를 form에 설정
      if (user.user.profileImg) {
        setFileList([{ url: user.user.profileImg }]);
      }
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [user, form]);

  const handleFinish = useCallback(
    async (formValues: any) => {
      try {
        await form.validateFields();
      } catch (error) {
        console.error("Validation failed:", error);
        return;
      }

      if (!session) {
        console.error("세션이 없습니다.");
        return;
      }
      const token = session.user.token;
      const url = user
        ? "https://syncd-backend.dev.i-dear.org/admin/user/update"
        : "https://syncd-backend.dev.i-dear.org/admin/user/add";
      const formData = new FormData();
      formData.append("email", formValues.email);
      formData.append("name", formValues.name);
      formData.append("status", formValues.status);
      formData.append("projectIdsJson", JSON.stringify(formValues.projectIds || []));

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("profileImg", fileList[0].originFileObj);
        console.log("Appending profile image file:", fileList[0].originFileObj);
      } else {
        console.log("No profile image file to append");
      }

      if (user && user.user && user.user.id) {
        formData.append("userId", user.user.id); // user.user.id를 formData에 추가
      } else {
        console.log("No user ID to append");
      }

      // Debugging: Print out all FormData entries
      for (const [key, value] of formData.entries()) {
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
          console.error("Failed to submit user", errorText);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    },
    [user, fileList, onFinish, onClose, session]
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
      <Form.Item
        name="email"
        label="이메일"
        rules={[
          { required: true, message: "이메일을 입력해주시길 바랍니다." },
          { type: "email", message: "유효한 이메일 주소를 입력해주시길 바랍니다." },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="name" label="이름" rules={[{ required: true, message: "이름을 입력해주시길 바랍니다." }]}>
        <Input />
      </Form.Item>
      <Form.Item name="status" label="상태" rules={[{ required: true, message: "사용자 상태에 대해서 설정해주시길 바랍니다." }]}>
        <Select>
          <Option value="available">Available</Option>
          <Option value="unavailable">Unavailable</Option>
        </Select>
      </Form.Item>
      <Form.Item name="profileImg" label="프로필 이미지">
        <Upload {...uploadProps} listType="picture">
          <Button icon={<UploadOutlined />}>이미지 업로드</Button>
        </Upload>
      </Form.Item>
      <Form.Item name="projectIds" label="프로젝트 ID">
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
