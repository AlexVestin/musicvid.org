import withRoot from './modules/withRoot';
// --- Post bootstrap -----
import React from 'react';
import Typography from './modules/components/Typography';
import LayoutBody from './modules/components/LayoutBody';
import AppAppBar from './modules/views/AppAppBar';
import AppFooter from './modules/views/AppFooter';

function Projects() {
  return (
    <React.Fragment>
      <AppAppBar />
      <LayoutBody margin marginBottom>
        <Typography variant="h3" gutterBottom marked="center" align="center">
            Projects
        </Typography>
      </LayoutBody>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(Projects);
