# Material Extended for Angular
[![npm version](https://badge.fury.io/js/%40material-extended%2Fmde.svg)](https://www.npmjs.com/package/%40material-extended%2Fmde)
[![Build Status](https://travis-ci.org/material-extended/mde.svg?branch=master)](https://travis-ci.org/material-extended/mde)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Gitter](https://badges.gitter.im/material-extended/mde.svg)](https://gitter.im/material-extended/mde?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)


### Project status
Angular Material Extended is currently in alpha.

This was originally created for demo purposed for a angular/material issue feature request.
Issue can be found at [angular/material2#2691](https://github.com/angular/material2/issues/2691)


If you'd like to contribute create an issue or pull request.

### Installation
Install npm package using:

`yarn add @material-extended/mde`

or

`npm install @material-extended/mde`


app.module.ts
```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MdePopoverModule } from '@material-extended/mde';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MdePopoverModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Todo
1. A design document needs creating to finalise requirements and API specifications.
Once a document is created the component can be refactored and released as beta for testing.
2. Refactor using @angular/cdk when released.


### Available features

| Feature | Notes                                                                                | Docs                                                                        |
|---------|--------------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| popover | In-progress ([demo](https://uixd.co.uk/open-source-software/material-extended/demo)) | [Docs](https://github.com/material-extended/mde/blob/master/src/lib/popover/popover.md) |
