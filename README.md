# ng-track-user

Angular directive for tracking time spend by user on sections on pages.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development purposes. See deployment for notes on how to deploy the project on a live system.

* Download the repository and add the files to your project.
* Directive is used to track the time spend by user on the different sections of the pages.
* Time will be tracked of all the sections which are in view.

## Directive rules to identify a section of a page is in view:

* Smaller section: If a section has height smaller than viewport height then it is considered as smaller section.
  - Smaller section is in view if and only if it is fully visible in the viewport.
  - If there are multiple sections in viewport and all has height smaller than viewport height then all the smaller sections which are fully visible in the viewport are considered to be in view.
* Greater Section: If a section has height greater than 3/4 of viewport height then it is considered as greater section.
  - If 50% or more of a greater section is visible in viewport than it is considered as in the view.
* If multiple smaller sections and a greater section is visible in viewport than all the smaller sections which are fully visible in viewport are considered in view and if the greater section is 50% or more in view than it is also considered in view.

## Deployment

```
  // import the directive
  import NgTrackUser from "./src/ngTrackUser";

  // register the directive
  angular.module('simpleDirective', [])
  .directive(NgTrackUser.NAME, NgTrackUser);
```

```
  <!-- Use the directive in html -->
  <!-- Section to track-->
  <div ng-track-user="current-section-id" id="current-section-id">
    <!-- content -->
  </div>  
```

## Example

Will be Uploaded soon.


