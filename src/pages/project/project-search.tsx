import DefaultSearchForm from "@/components/shared/form/ui/default-search-form";
import FieldInline from "@/components/shared/form/ui/field-inline";
import FormSearch from "@/components/shared/form/ui/form-search";
import { Button, DatePicker, Form, Input, InputNumber } from "antd";
import { useForm } from "antd/lib/form/Form";
import { Search } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";

const { RangePicker } = DatePicker;

const ProjectSearch: React.FC = () => {
  const [form] = useForm();
  const router = useRouter();

  // Set initial form values based on query parameters
  useEffect(() => {
    const { name, userId, leftChanceForUserstory, startDate, endDate, progress } = router.query;

    // Check if startDate and endDate are valid dates before setting
    const dateRange =
      startDate && endDate ? [moment(startDate, moment.ISO_8601), moment(endDate, moment.ISO_8601)] : [];

    const initialValues = {
      name: name || "",
      userId: userId || "",
      leftChanceForUserstory: leftChanceForUserstory ? Number(leftChanceForUserstory) : undefined,
      dateRange: dateRange,
      progress: progress ? Number(progress) : undefined,
    };

    form.setFieldsValue(initialValues);

    console.log("Initial form values:", initialValues);
  }, [router.query, form]);

  const handleFinish = useCallback(
    (formValue: any) => {
      const { name, userId, leftChanceForUserstory, dateRange, progress } = formValue;

      // Formulate the query params
      const query: any = { page: 1 }; // Reset to first page on search
      if (name) query.name = name;
      if (userId) query.userId = userId;
      if (leftChanceForUserstory !== undefined) query.leftChanceForUserstory = leftChanceForUserstory;
      if (dateRange && dateRange.length === 2) {
        query.startDate = dateRange[0].toISOString();
        query.endDate = dateRange[1].toISOString();
      }
      if (progress !== undefined) query.progress = progress;

      console.log("Form values on finish:", formValue);
      console.log("Query:", query);

      // Navigate with query params
      router.push({
        pathname: router.pathname,
        query,
      });
    },
    [router]
  );

  return (
    <DefaultSearchForm form={form} onFinish={handleFinish}>
      <FormSearch>
        <FieldInline>
          <Form.Item label="프로젝트명" name="name">
            <Input placeholder="프로젝트명을 입력해주세요" />
          </Form.Item>
          <Form.Item label="사용자 ID" name="userId">
            <Input placeholder="사용자 ID를 입력해주세요" />
          </Form.Item>
        </FieldInline>
        <FieldInline>
          <Form.Item label="남은 기회" name="leftChanceForUserstory">
            <InputNumber placeholder="숫자를 입력해주세요" />
          </Form.Item>
          <Form.Item label="진행률" name="progress">
            <InputNumber placeholder="숫자를 입력해주세요" min={0} max={100} />
          </Form.Item>
        </FieldInline>
        <Form.Item label="마지막 수정일" name="dateRange">
          <RangePicker />
        </Form.Item>
      </FormSearch>
      <div className="flex justify-center gap-2">
        <Button htmlType="submit" className="btn-with-icon" icon={<Search />}>
          검색
        </Button>
        <Button htmlType="button" className="btn-with-icon" onClick={() => form.resetFields()}>
          초기화
        </Button>
      </div>
    </DefaultSearchForm>
  );
};

export default React.memo(ProjectSearch);
