## App



The component that wraps the entire app.
## CardComponent

`components > containers`

A simple card component used to store other containers in a more presentable way.

### Props:

Name | Type | Description | Required
---- | ---- | ----------- | :------:
className | string |  | ❌
title | string | The title to be shown in the card header | ❌
children | node \| node[] |  | ❌
## CompatiblePartsContainer

`components > containers`

This is the card that contains all the compatible parts for the
chosen engine (if one has been chosen).
Uses CalculatorContext from CalculatorSection.
## AboutSection

`components > sections`

This section describes the project and
legal details.
## EngineContainer

`components > containers`

This is the card that contains the dropdown for the engine choice
as well as standard details about the
chosen engine (if one has been chosen).
Uses CalculatorContext from CalculatorSection.
## SelectedPartsContainer

`components > containers`

This is the card that contains all the selected parts
the user has selected (if they have selected any) and
the total stats of their tuning setup.
Uses CalculatorContext from CalculatorSection.

### Props:

Name | Type | Description | Required
---- | ---- | ----------- | :------:
className | string |  | ❌
## FooterInfoSection

`components > sections`

The footer sections that provides links for suggestions and feedback
## NavbarSection

`components > sections`

The bar that allows the user to navigate different parts of the app.
## CalculatorSection

`components > sections`

This section includes all the components necessary for the Calculator.
Uses CalculatorContext.
