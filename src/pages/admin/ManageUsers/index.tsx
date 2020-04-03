import React from 'react';

import styles from './index.less';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';

function ManageUsers({ applyRecords, dispatch }: any) {
  console.log(applyRecords, 'applyRecords');

  React.useEffect(() => {
    dispatch({
      type: 'application/getApplyRecords',
    });
  }, []);

  return (
    <div className={styles.normal}>
      <h1>Page ManageUsers</h1>
      <pre>{applyRecords}</pre>
    </div>
  );
}

export default connect(({ application }: ConnectState) => ({
  applyRecords: application.applyRecords,
}))(ManageUsers);


