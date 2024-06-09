import { Alert, Button, Form, Input, Modal } from "antd";
import { useForm } from "antd/lib/form/Form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";

interface ILoginFormValue {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [form] = useForm<ILoginFormValue>();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleFinish = useCallback(async (value: ILoginFormValue) => {
    setIsLoading(true);

    const result = await signIn("login-credentials", {
      redirect: false,
      email: value.email,
      password: value.password,
    });

    if (result && result.error) {
      setModalMessage(result.error);
      setIsModalVisible(true);
      setIsLoading(false);
    } else {
      router.push("/");
    }
  }, [router]);

  const handleModalClose = () => {
    setIsModalVisible(false);
    setModalMessage("");
  };

  return (
    <>
      {router?.query.error && router?.query.error !== "CredentialsSignin" ? (
        <div className="mb-3">
          <Alert message={`로그인 중 오류가 발생했습니다. ${router?.query.error}`} type="warning" />
        </div>
      ) : null}
      <Form<ILoginFormValue>
        form={form}
        layout="vertical"
        initialValues={{ email: "", password: "" }}
        onFinish={handleFinish}
      >
        <div className="mb-3">
          {router?.query.error === "CredentialsSignin" ? (
            <Alert message="로그인을 실패했습니다. 아이디 또는 비밀번호를 다시 확인해주세요." type="error" />
          ) : null}
        </div>
        <Form.Item name="email" rules={[{ required: true, message: "이메일을 입력해주세요" }]}>
          <Input size="large" placeholder="이메일" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: "비밀번호를 입력해주세요" }]}>
          <Input placeholder="비밀번호" type="password" size="large" />
        </Form.Item>
        <Button size="large" type="primary" htmlType="submit" className="w-full" loading={isLoading}>
          로그인
        </Button>
      </Form>
      <Modal
        title="로그인 실패"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" type="primary" onClick={handleModalClose}>
            닫기
          </Button>
        ]}
      >
        <p>{modalMessage}</p>
      </Modal>
    </>
  );
};

export default React.memo(LoginForm);
