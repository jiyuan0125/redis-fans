import React from 'react';
import {
  Button,
  Typography,
  ExpansionPanelSummary,
  ExpansionPanel,
  ExpansionPanelDetails,
} from '@material-ui/core';

export interface AppErrorState {
  error?: Error;
  errorInfo?: { componentStack: any };
  expanded: boolean;
}

export class AppError extends React.Component<any, AppErrorState> {
  constructor(props: any) {
    super(props);
    this.state = {
      error: undefined,
      errorInfo: undefined,
      expanded: false,
    };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: any }) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  handleChange = (_ev: React.ChangeEvent<{}>, _newExpanded: boolean) => {
    this.setState((state) => ({ ...state, expanded: !state.expanded }));
  };

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div>
          <Typography variant="h3">Something went wrong.</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              window.location = window.location;
            }}
          >
            Reload
          </Button>
          <ExpansionPanel
            square
            expanded={this.state.expanded}
            onChange={this.handleChange}
          >
            <ExpansionPanelSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
              <Typography>
                {this.state.error && this.state.error.toString()}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <pre>{this.state.errorInfo.componentStack}</pre>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}
