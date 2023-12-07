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
        {value.split('\n').map((line, index, lines) => {
          const style = line.match(/^#/) && styles.header;
          return (
            <Fragment key={`${index}-${line}`}>
              <Text style={style}>{ line }</Text>
              {lines.length === index + 1 ? null : '\n'}
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
