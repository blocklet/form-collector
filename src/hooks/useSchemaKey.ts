import useSearchParam from 'react-use/lib/useSearchParam';

export default function useSchemaKey(): string {
  const schemaKey = useSearchParam('schemaKey') || '';
  return schemaKey.startsWith('http://') || schemaKey.startsWith('https://') ? schemaKey : '';
}
