import DefaultSearchForm from "@/components/shared/form/ui/default-search-form";
import FieldInline from "@/components/shared/form/ui/field-inline";
import FormSearch from "@/components/shared/form/ui/form-search";
import { Button, Form, Input, Radio, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import { Search } from "lucide-react";
import { useRouter } from "next/router";
import React, { useCallback } from "react";

const statusOptions = [
  { label: "전체", value: "ALL" },
  { label: "사용 가능", value: "available" },
  { label: "사용 불가", value: "unavailable" },
];

const UserSearch: React.FC = () => {
  const [form] = useForm();
  const router = useRouter();

  const handleFinish = useCallback(
    (formValue: any) => {
      const { status, searchType, searchText } = formValue;

      // Formulate the query params
      const query: any = {};
      if (status && status !== "ALL") {
        query.status = status;
      }
      if (searchType) {
        query.searchType = searchType;
      }
      if (searchText) {
        query.searchText = searchText;
      }

      console.log("Query:", query);

      // Navigate with query params
      router.push({
        pathname: router.pathname,
        query,
      });
    },
    [router]
  );

  const handleReset = useCallback(() => {
    form.resetFields();
    router.push({
      pathname: router.pathname,
      query: { status: "ALL", searchType: "userName", searchText: "" },
    });
  }, [form, router]);

  return (
    <DefaultSearchForm form={form} onFinish={handleFinish}>
      <FormSearch>
        <div>
          <Form.Item name="status" label="사용자 상태" initialValue="ALL">
            <Radio.Group>
              {statusOptions.map((option) => (
                <Radio.Button key={option.value} value={option.value}>
                  {option.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
        </div>
        <div>
          <FieldInline>
            <Form.Item label="검색 조건" name="searchType" initialValue="userName">
              <Select popupMatchSelectWidth={false}>
                <Select.Option value="userName">사용자명</Select.Option>
                <Select.Option value="email">이메일</Select.Option>
                <Select.Option value="projectId">프로젝트 ID</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="searchText" className="grow">
              <Input placeholder="검색어를 입력해주세요" />
            </Form.Item>
          </FieldInline>
        </div>
      </FormSearch>
      <div className="flex justify-center gap-2">
        <Button htmlType="submit" className="btn-with-icon" icon={<Search />}>
          검색
        </Button>
        <Button htmlType="button" className="btn-with-icon" onClick={handleReset}>
          초기화
        </Button>
      </div>
    </DefaultSearchForm>
  );
};

export default React.memo(UserSearch);
