import DefaultSearchForm from "@/components/shared/form/ui/default-search-form";
import FieldInline from "@/components/shared/form/ui/field-inline";
import FormSearch from "@/components/shared/form/ui/form-search";
import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import { Search } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

const { RangePicker } = DatePicker;
const { Option } = Select;

const ProjectSearch: React.FC = () => {
  const [form] = useForm();
  const router = useRouter();
  const [selectedCondition, setSelectedCondition] = useState<string>("name");

  useEffect(() => {
    const { name, userId, leftChanceForUserstory, startDate, endDate, progress, userName } = router.query;

    const dateRange =
      startDate && endDate ? [moment(startDate, moment.ISO_8601), moment(endDate, moment.ISO_8601)] : [];

    const initialValues = {
      name: name || "",
      userId: userId || "",
      leftChanceForUserstory: leftChanceForUserstory ? Number(leftChanceForUserstory) : undefined,
      dateRange: dateRange,
      progress: progress ? Number(progress) : undefined,
      userName: userName || "",
      searchCondition: selectedCondition,
    };

    form.setFieldsValue(initialValues);
  }, [router.query, form, selectedCondition]);

  const handleFinish = useCallback(
    (formValue: any) => {
      const { name, userId, leftChanceForUserstory, dateRange, progress, userName } = formValue;

      const query: any = { page: 1 };
      if (selectedCondition === "name" && name) query.name = name;
      if (selectedCondition === "userId" && userId) query.userId = userId;
      if (selectedCondition === "leftChanceForUserstory" && leftChanceForUserstory !== undefined) query.leftChanceForUserstory = leftChanceForUserstory;
      if (selectedCondition === "userName" && userName) query.userName = userName;
      if (selectedCondition === "dateRange") {
        if (dateRange && dateRange.length === 2) {
          query.startDate = dateRange[0].toISOString();
          query.endDate = dateRange[1].toISOString();
        } else {
          const startDate = moment().startOf('year');
          const endDate = moment().endOf('year');
          query.startDate = startDate.toISOString();
          query.endDate = endDate.toISOString();
        }
      }
      if (selectedCondition === "progress" && progress !== undefined) query.progress = progress;

      router.push({
        pathname: router.pathname,
        query,
      });
    },
    [router, selectedCondition]
  );

  const handleConditionChange = (value: string) => {
    setSelectedCondition(value);
    form.resetFields();
    
    if (value === "dateRange") {
      const startDate = moment().startOf('year');
      const endDate = moment().endOf('year');
      form.setFieldsValue({ dateRange: [startDate, endDate] });
    }
  };

  return (
    <DefaultSearchForm form={form} onFinish={handleFinish}>
      <FormSearch>
        <FieldInline>
          <Form.Item label="검색 조건" name="searchCondition">
            <Select value={selectedCondition} onChange={handleConditionChange}>
              <Option value="name">프로젝트명</Option>
              <Option value="userId">사용자 ID</Option>
              <Option value="leftChanceForUserstory">남은 기회</Option>
              <Option value="userName">사용자 이름</Option>
              <Option value="progress">진행률</Option>
            </Select>
          </Form.Item>
          {selectedCondition === "name" && (
            <Form.Item name="name" rules={[{ required: false, message: "프로젝트명을 입력해주세요" }]}>
              <Input placeholder="프로젝트명을 입력해주세요" />
            </Form.Item>
          )}
          {selectedCondition === "userId" && (
            <Form.Item name="userId" rules={[{ required: false, message: "사용자 ID를 입력해주세요" }]}>
              <Input placeholder="사용자 ID를 입력해주세요" />
            </Form.Item>
          )}
          {selectedCondition === "leftChanceForUserstory" && (
            <Form.Item name="leftChanceForUserstory" rules={[{ required: false, message: "남은 기회를 입력해주세요" }]}>
              <InputNumber placeholder="숫자를 입력해주세요" />
            </Form.Item>
          )}
          {selectedCondition === "userName" && (
            <Form.Item name="userName" rules={[{ required: false, message: "사용자 이름을 입력해주세요" }]}>
              <Input placeholder="사용자 이름을 입력해주세요" />
            </Form.Item>
          )}
        
            <Form.Item name="dateRange" rules={[{ required: false, message: "날짜 범위를 선택해주세요" }]}>
              <RangePicker />
            </Form.Item>
     
          {selectedCondition === "progress" && (
            <Form.Item name="progress" rules={[{ required: false, message: "진행률을 입력해주세요" }]}>
              <InputNumber placeholder="숫자를 입력해주세요" min={0} max={100} />
            </Form.Item>
          )}
        </FieldInline>
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
