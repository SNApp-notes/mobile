import { useState, Fragment } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  StyleProp,
  TextStyle
} from 'react-native';

type EditorProps = {
  initValue: string;
  style?: StyleProp<TextStyle>;
  onChange?: (value: string) => void;
};


const Editor = ({ initValue, style, onChange = () => {} }: EditorProps) => {
  const [value, setValue] = useState<string>(initValue);

  const changeHandler = (text: string) => {
    setValue(text);
    onChange(text);
  };

  return (
    <TextInput
      style={[styles.editor, style]}
      multiline
      autoComplete="off"
      autoCorrect={false}
      autoFocus={true}
      onChangeText={changeHandler}>
      <Text>
        {value.split(/(\n)/).map((line, index) => {
          const key = `${index}-${line}`;
          if (line === '\n') {
            return <Text key={key}>{ line }</Text>;
          }
          const style = line.match(/^#/) && styles.header;

          const components = line.split(/(\[[x ]\])/).map((str, index) => {
            const key = `${index}-${str}`;
            if (['[ ]', '[x]'].includes(str)) {
              return <Text key={key} onPress={() => alert('x')}>{ str }</Text>;
            }
            return <Text key={key}>{ str }</Text>
          });

          return (
            <Fragment key={key}>
              <Text style={style}>{ components }</Text>
            </Fragment>
          );
        })}
      </Text>
    </TextInput>
  );
};

export default Editor;

const styles = StyleSheet.create({
  editor: {
    textAlignVertical: 'top',
    textAlign: 'left',
    backgroundColor: 'white',
    flex: 1,
    fontFamily: 'monospace',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  header: {
    fontWeight: "900",
    color: '#0045C9',
  },
});
