## App

The component that wraps the entire app.

## CardComponent

`components > containers`

A simple card component used to store other containers in a more presentable way.


### Props:

| Name      | Type           | Description                              | Required |
| --------- | -------------- | ---------------------------------------- | :------: |
| className | string         |                                          |    ❌     |
| title     | string         | The title to be shown in the card header |    ❌     |
| children  | node \| node[] |                                          |    ❌     |

## AboutSection

`components > sections`

This section describes the project and
legal details.

## CompatiblePartsCard

`components > containers`

This is the card that contains all the compatible parts for the
chosen engine (if one has been chosen).
Uses CalculatorContext from CalculatorSection.


### Props:

| Name      | Type   | Description | Required |
| --------- | ------ | ----------- | :------: |
| className | string |             |    ❌     |

## EngineCard

`components > containers`

This is the card that contains the dropdown for the engine choice
as well as standard details about the
chosen engine (if one has been chosen).
Uses CalculatorContext from CalculatorSection.

## CalculatorSection

`components > sections`

This section includes all the components necessary for the Calculator.
Uses CalculatorContext.

## PrePartsTableRow

`components > containers`

Used before the tables in the CompatiblePartsContainer and SelectedPartsContainer.
Includes sorting choice and disclaimer for visibility on small screens.


### Props:

| Name           | Type | Description                               | Required |
| -------------- | ---- | ----------------------------------------- | :------: |
| onSortByChange | func | The method used to change value of sortBy |    ✅     |

## SelectedPartsCard

`components > containers`

This is the card that contains all the selected parts
the user has selected (if they have selected any) and
the total stats of their tuning setup.
Uses CalculatorContext from CalculatorSection.


### Props:

| Name      | Type   | Description | Required |
| --------- | ------ | ----------- | :------: |
| className | string |             |    ❌     |

## FooterInfoSection

`components > sections`

The footer sections that provides links for suggestions and feedback

## SetupSuggestionCard

`components > containers`

No description provided


### Props:

| Name      | Type   | Description | Required |
| --------- | ------ | ----------- | :------: |
| className | string |             |    ❌     |

## NavbarSection

`components > sections`

The bar that allows the user to navigate different parts of the app.

