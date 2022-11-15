import 'antd/dist/antd.less';
import React from 'react';
import axios from 'axios';
import useAsync from 'react-use/lib/useAsync';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Row, Button, Rate, Slider, Alert, Spin, message } from 'antd';
import {
  Form,
  Input,
  Select,
  TreeSelect,
  Cascader,
  Radio,
  Checkbox,
  NumberPicker,
  Transfer,
  Password,
  DatePicker,
  TimePicker,
  Upload,
  Switch,
  ArrayCards,
  ArrayTable,
  Space,
  FormItem,
  FormTab,
  FormCollapse,
  FormLayout,
  FormGrid,
} from '@formily/antd';
import useSchemaKey from '../../hooks/useSchemaKey';

const api = axios.create({ timeout: 8000 });
const formatError = (err) => {
  if (Array.isArray(err.errors)) {
    return err.errors.map((x) => x.message).join('\n');
  }
  if (err.response) {
    return err.response.data.error;
  }

  return err.message;
};

const form = createForm({
  validateFirst: true,
});

const SchemaField = createSchemaField({
  components: {
    Form,
    Input,
    Select,
    TreeSelect,
    Cascader,
    Radio,
    Checkbox,
    Slider,
    Rate,
    NumberPicker,
    Transfer,
    Password,
    DatePicker,
    TimePicker,
    Upload,
    Switch,
    ArrayCards,
    ArrayTable,
    Space,
    FormItem,
    FormTab,
    FormCollapse,
    FormLayout,
    FormGrid,
  },
});

const Center = ({ children }) => (
  <Row style={{ display: 'flex', height: '100vh' }} align="middle" justify="center">
    {children}
  </Row>
);

export default function FormCollector() {
  const schemaKey = useSchemaKey();
  const state = useAsync(async () => {
    if (!schemaKey) {
      return null;
    }

    const { data } = await api.get(schemaKey);
    return typeof data === 'object' ? data : {};
  });

  if (!schemaKey) {
    return (
      <Center>
        <Alert message="Oops" description="Form Collector requires a valid schemaKey to work" type="error" />
      </Center>
    );
  }

  if (state.loading) {
    return (
      <Center>
        <Spin size="large" />
      </Center>
    );
  }

  if (state.error) {
    return (
      <Center>
        <Alert message="Oops" description={`Failed to load form schema: ${state.error.message}`} type="error" />
      </Center>
    );
  }

  const config = state.value;
  const onSubmit = async (data) => {
    try {
      await api.post(schemaKey, data);
      message.success('Form data successfully submitted');
    } catch (err) {
      message.error(formatError(err));
    }
  };

  return (
    <Form form={form} {...config.form} onAutoSubmit={onSubmit}>
      <SchemaField schema={config.schema} />
      <div className="form-actions">
        <Button htmlType="submit" type="primary">
          Save Changes
        </Button>
      </div>
    </Form>
  );
}

FormCollector.propTypes = {};

FormCollector.defaultProps = {};
