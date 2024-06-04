import 'antd/dist/antd.less';
import React from 'react';
import axios from 'axios';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import useAsync from 'react-use/lib/useAsync';
import useSearchParam from 'react-use/lib/useSearchParam';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Row, Card, Button, Rate, Slider, Alert, Spin, message } from 'antd';
import {
  ArrayCards,
  ArrayTable,
  Cascader,
  Checkbox,
  DatePicker,
  Editable,
  Form,
  FormCollapse,
  FormGrid,
  FormItem,
  FormLayout,
  FormTab,
  Input,
  NumberPicker,
  Password,
  PreviewText,
  Radio,
  Reset,
  Select,
  Space,
  Submit,
  Switch,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
} from '@formily/antd';
import useSchemaKey from '../../hooks/useSchemaKey';

const Text: React.FC<{
  value?: string;
  content?: string;
  mode?: 'normal' | 'h1' | 'h2' | 'h3' | 'p';
}> = ({ value, mode, content, ...props }) => {
  const tagName = mode === 'normal' || !mode ? 'div' : mode;
  return React.createElement(tagName, props, value || content);
};

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
    ArrayCards,
    ArrayTable,
    Card,
    Cascader,
    Checkbox,
    DatePicker,
    Editable,
    FormCollapse,
    FormGrid,
    FormItem,
    FormLayout,
    FormTab,
    Input,
    NumberPicker,
    Password,
    PreviewText,
    Radio,
    Rate,
    Reset,
    Select,
    Slider,
    Space,
    Submit,
    Switch,
    Text,
    TimePicker,
    Transfer,
    TreeSelect,
    Upload,
  },
});

const Center = ({ children }) => (
  <Row style={{ display: 'flex', height: '100vh' }} align="middle" justify="center">
    {children}
  </Row>
);

const getAuthHeaders = (authKey: string) => {
  const headers: any = {};
  if (authKey) {
    const authToken = window.localStorage.getItem(authKey);
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
  }

  return headers;
};

export default function FormCollector() {
  const schemaKey = useSchemaKey();
  const authKey = useSearchParam('authKey') || '';

  const state = useAsync(async () => {
    if (!schemaKey) {
      return null;
    }

    const { data } = await api.get(schemaKey, { headers: getAuthHeaders(authKey) });
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
        <Alert message="Oops" description={`Failed to load form schema: ${formatError(state.error)}`} type="error" />
      </Center>
    );
  }

  const config = state.value;
  if (isEmpty(get(config, 'schema.properties'))) {
    return (
      <Center>
        <Alert message="No customization available" type="info" showIcon />
      </Center>
    );
  }

  const onSubmit = async (data) => {
    try {
      await api.post(schemaKey, data, { headers: getAuthHeaders(authKey) });
      message.success('Form data successfully submitted');
    } catch (err) {
      message.error(formatError(err));
    }

    setTimeout(() => {
      const parent = window.self;
      parent.opener = window.self;
      parent.close();
    }, 1000);
  };

  return (
    <Form form={form} {...config.form} onAutoSubmit={onSubmit}>
      <SchemaField schema={config.schema} />
      <div
        className="form-actions"
        style={{
          marginTop: '16px',
        }}>
        <Button htmlType="submit" type="primary">
          Save Changes
        </Button>
      </div>
    </Form>
  );
}

FormCollector.propTypes = {};

FormCollector.defaultProps = {};
