import React from 'react';

import styles from './index.less';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';

function ManageUsers({ applyRecords, init }: any) {
  // console.log(applyRecords, 'applyRecords');

  React.useEffect(() => {
    init()
  }, []);

  return (
    <div className={styles.normal}>
      <h1>Page ManageUsers</h1>
      <pre>{JSON.stringify(applyRecords)}</pre>
    </div>
  );
}

export default connect(
  ({ application }: ConnectState) => ({
    applyRecords: application.applyRecords,
  }),
  {
    init: () => ({
      type: 'application/getApplyRecords',
    }),
  },
)(ManageUsers);


