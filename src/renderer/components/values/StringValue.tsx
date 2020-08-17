import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { DataObject, Settings, MessageType } from '@src/types';
import React from 'react';
import _ from 'lodash';
import { Value } from './Value';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    stringValueRoot: {
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
    },
    stringValueHeader: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    stringValueContent: {
      flexGrow: 1,
    },
    viewAsControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  })
);

interface StringValueProp {
  object: DataObject<'string'>;
  updateObjectValue: (object: DataObject, value: string) => void;
  appSettings: Settings;
  refreshIndicator: number;
  showMessage: (
    type: MessageType,
    content: string,
    description?: string
  ) => void;
}

export const StringValue = React.memo((props: StringValueProp) => {
  const {
    object,
    updateObjectValue,
    appSettings,
    refreshIndicator,
    showMessage,
  } = props;
  const classes = useStyles();
  const [value, setValue] = React.useState(object.value);
  const rootDOMRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setValue(props.object.value);
  }, [props.object.value, refreshIndicator]);

  const handleValueChange = (value: string) => {
    setValue(value);
  };

  const handleSaveValue = () => {
    updateObjectValue(props.object, value!);
  };

  return (
    <div ref={rootDOMRef} className={classes.stringValueRoot}>
      <Value
        label="Value"
        value={value}
        onValueChange={handleValueChange}
        onSaveValue={handleSaveValue}
        appSettings={appSettings}
        showMessage={showMessage}
      />
    </div>
  );
});
