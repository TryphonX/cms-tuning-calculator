## Modules

<dl>
<dt><a href="#module_common">common</a></dt>
<dd></dd>
<dt><a href="#module_contexts">contexts</a></dt>
<dd></dd>
<dt><a href="#module_customEvents">customEvents</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#CompatiblePart">CompatiblePart</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#EngineSpecs">EngineSpecs</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Engine">Engine</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#SelectedPart">SelectedPart</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#TuningPart">TuningPart</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#CompareFunction">CompareFunction</a> ⇒ <code>number</code></dt>
<dd></dd>
</dl>

<a name="module_common"></a>

## common

* [common](#module_common)
    * _static_
        * [.PartSortBy](#module_common.PartSortBy) : <code>enum</code>
        * [.engines](#module_common.engines) : [<code>Engine</code>](#Engine)
        * [.getCompareFn(sortBy)](#module_common.getCompareFn) ⇒ [<code>CompareFunction</code>](#CompareFunction)
        * [.getTunedPartByName(partName)](#module_common.getTunedPartByName) ⇒ [<code>TuningPart</code>](#TuningPart) \| <code>undefined</code>
    * _inner_
        * [~compareNamesAsc(a, b)](#module_common..compareNamesAsc) : [<code>CompareFunction</code>](#CompareFunction)
        * [~compareNamesDesc(a, b)](#module_common..compareNamesDesc) : [<code>CompareFunction</code>](#CompareFunction)
        * [~compareQtAsc(a, b)](#module_common..compareQtAsc) : [<code>CompareFunction</code>](#CompareFunction)
        * [~compareQtDesc(a, b)](#module_common..compareQtDesc) : [<code>CompareFunction</code>](#CompareFunction)
        * [~compareCostAsc(a, b)](#module_common..compareCostAsc) : [<code>CompareFunction</code>](#CompareFunction)
        * [~compareCostDesc(a, b)](#module_common..compareCostDesc) : [<code>CompareFunction</code>](#CompareFunction)
        * [~compareBoostAsc(a, b)](#module_common..compareBoostAsc) : [<code>CompareFunction</code>](#CompareFunction)
        * [~compareBoostDesc(a, b)](#module_common..compareBoostDesc) : [<code>CompareFunction</code>](#CompareFunction)
        * [~compareCostToBoostAsc(a, b)](#module_common..compareCostToBoostAsc) : [<code>CompareFunction</code>](#CompareFunction)
        * [~compareCostToBoostDesc(a, b)](#module_common..compareCostToBoostDesc) : [<code>CompareFunction</code>](#CompareFunction)

<a name="module_common.PartSortBy"></a>

### common.PartSortBy : <code>enum</code>
Sort modes for parts

**Kind**: static enum of [<code>common</code>](#module_common)  
<a name="module_common.engines"></a>

### common.engines : [<code>Engine</code>](#Engine)
The list of all engines included in the app.

**Kind**: static constant of [<code>common</code>](#module_common)  
<a name="module_common.getCompareFn"></a>

### common.getCompareFn(sortBy) ⇒ [<code>CompareFunction</code>](#CompareFunction)
Returns a comparison function based on the given `sortBy` parameter.

**Kind**: static method of [<code>common</code>](#module_common)  

| Param | Type | Description |
| --- | --- | --- |
| sortBy | <code>string</code> | The value that determines the sorting order for a list of parts. |

<a name="module_common.getTunedPartByName"></a>

### common.getTunedPartByName(partName) ⇒ [<code>TuningPart</code>](#TuningPart) \| <code>undefined</code>
Returns the tuned part based on the given part name.

**Kind**: static method of [<code>common</code>](#module_common)  

| Param | Type | Description |
| --- | --- | --- |
| partName | <code>string</code> | A string representing the name of a tuning part. |

<a name="module_common..compareNamesAsc"></a>

### common~compareNamesAsc(a, b) : [<code>CompareFunction</code>](#CompareFunction)
Compares two objects based on their name property (ascending).

**Kind**: inner method of [<code>common</code>](#module_common)  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Object</code> | Represents the first object being compared based on its name property. |
| b | <code>Object</code> | Represents the second object being compared. |

<a name="module_common..compareNamesDesc"></a>

### common~compareNamesDesc(a, b) : [<code>CompareFunction</code>](#CompareFunction)
Compares two objects based on their name property (descending).

**Kind**: inner method of [<code>common</code>](#module_common)  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Object</code> | Represents the first object being compared based on its name property. |
| b | <code>Object</code> | Represents the second object being compared. |

<a name="module_common..compareQtAsc"></a>

### common~compareQtAsc(a, b) : [<code>CompareFunction</code>](#CompareFunction)
Compares two objects based on their quantity property (ascending).

**Kind**: inner method of [<code>common</code>](#module_common)  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Object</code> | Represents the first object being compared based on its quantity property. |
| b | <code>Object</code> | Represents the second object being compared. |

<a name="module_common..compareQtDesc"></a>

### common~compareQtDesc(a, b) : [<code>CompareFunction</code>](#CompareFunction)
Compares two objects based on their quantity property (descending).

**Kind**: inner method of [<code>common</code>](#module_common)  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Object</code> | Represents the first object being compared based on its quantity property. |
| b | <code>Object</code> | Represents the second object being compared. |

<a name="module_common..compareCostAsc"></a>

### common~compareCostAsc(a, b) : [<code>CompareFunction</code>](#CompareFunction)
Compares two objects based on their tuned part version's cost property (ascending).

**Kind**: inner method of [<code>common</code>](#module_common)  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Object</code> | Represents the first object being compared based on its name property. |
| b | <code>Object</code> | Represents the second object being compared. |

<a name="module_common..compareCostDesc"></a>

### common~compareCostDesc(a, b) : [<code>CompareFunction</code>](#CompareFunction)
Compares two objects based on their tuned part version's cost property (descending).

**Kind**: inner method of [<code>common</code>](#module_common)  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Object</code> | Represents the first object being compared based on its name property. |
| b | <code>Object</code> | Represents the second object being compared. |

<a name="module_common..compareBoostAsc"></a>

### common~compareBoostAsc(a, b) : [<code>CompareFunction</code>](#CompareFunction)
Compares two objects based on their tuned part version's boost property (ascending).

**Kind**: inner method of [<code>common</code>](#module_common)  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Object</code> | Represents the first object being compared based on its name property. |
| b | <code>Object</code> | Represents the second object being compared. |

<a name="module_common..compareBoostDesc"></a>

### common~compareBoostDesc(a, b) : [<code>CompareFunction</code>](#CompareFunction)
Compares two objects based on their tuned part version's boost property (descending).

**Kind**: inner method of [<code>common</code>](#module_common)  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Object</code> | Represents the first object being compared based on its name property. |
| b | <code>Object</code> | Represents the second object being compared. |

<a name="module_common..compareCostToBoostAsc"></a>

### common~compareCostToBoostAsc(a, b) : [<code>CompareFunction</code>](#CompareFunction)
Compares two objects based on their tuned part version's costToBoost property (ascending).

**Kind**: inner method of [<code>common</code>](#module_common)  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Object</code> | Represents the first object being compared based on its name property. |
| b | <code>Object</code> | Represents the second object being compared. |

<a name="module_common..compareCostToBoostDesc"></a>

### common~compareCostToBoostDesc(a, b) : [<code>CompareFunction</code>](#CompareFunction)
Compares two objects based on their tuned part version's costToBoost property (descending).

**Kind**: inner method of [<code>common</code>](#module_common)  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Object</code> | Represents the first object being compared based on its name property. |
| b | <code>Object</code> | Represents the second object being compared. |

<a name="module_contexts"></a>

## contexts
<a name="module_contexts.CalculatorContext"></a>

### contexts.CalculatorContext : <code>React.Context</code>
The React.Context used for transferring data between calculator components.

**Kind**: static constant of [<code>contexts</code>](#module_contexts)  
**Properties**

| Name | Type |
| --- | --- |
| currentEngine | [<code>Nullable.&lt;Engine&gt;</code>](#Engine) | 
| selectedParts | [<code>Array.&lt;SelectedPart&gt;</code>](#SelectedPart) | 

<a name="module_customEvents"></a>

## customEvents

* [customEvents](#module_customEvents)
    * [.ClearSelectedPartsEvent](#module_customEvents.ClearSelectedPartsEvent) ⇐ <code>CustomEvent</code>
    * [.UpdateSelectedPartsEvent](#module_customEvents.UpdateSelectedPartsEvent) ⇐ <code>CustomEvent</code>
        * [new exports.UpdateSelectedPartsEvent(newVal)](#new_module_customEvents.UpdateSelectedPartsEvent_new)
    * [.UpdateEngineEvent](#module_customEvents.UpdateEngineEvent) ⇐ <code>CustomEvent</code>
        * [new exports.UpdateEngineEvent(newVal)](#new_module_customEvents.UpdateEngineEvent_new)

<a name="module_customEvents.ClearSelectedPartsEvent"></a>

### customEvents.ClearSelectedPartsEvent ⇐ <code>CustomEvent</code>
A [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) for clearing the [selectedParts](#module_contexts.CalculatorContext).

**Kind**: static class of [<code>customEvents</code>](#module_customEvents)  
**Extends**: <code>CustomEvent</code>  
**See**

- https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
- https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
- https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

<a name="module_customEvents.UpdateSelectedPartsEvent"></a>

### customEvents.UpdateSelectedPartsEvent ⇐ <code>CustomEvent</code>
A [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) for updating the [selectedParts](#module_contexts.CalculatorContext).

**Kind**: static class of [<code>customEvents</code>](#module_customEvents)  
**Extends**: <code>CustomEvent</code>  
**See**

- https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
- https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
- https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

<a name="new_module_customEvents.UpdateSelectedPartsEvent_new"></a>

#### new exports.UpdateSelectedPartsEvent(newVal)

| Param | Type | Description |
| --- | --- | --- |
| newVal | [<code>Array.&lt;SelectedPart&gt;</code>](#SelectedPart) | The new value to replace the previous [selectedParts](#module_contexts.CalculatorContext) |

<a name="module_customEvents.UpdateEngineEvent"></a>

### customEvents.UpdateEngineEvent ⇐ <code>CustomEvent</code>
A [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) for updating the [currentEngine](#module_contexts.CalculatorContext).

**Kind**: static class of [<code>customEvents</code>](#module_customEvents)  
**Extends**: <code>CustomEvent</code>  
**See**

- https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
- https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
- https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

<a name="new_module_customEvents.UpdateEngineEvent_new"></a>

#### new exports.UpdateEngineEvent(newVal)

| Param | Type | Description |
| --- | --- | --- |
| newVal | [<code>Nullable.&lt;Engine&gt;</code>](#Engine) | The new value to replace the previous [currentEngine](#module_contexts.CalculatorContext) |

<a name="EngineName"></a>

## EngineName : <code>enum</code>
Engine names

**Kind**: global enum  
<a name="PartName"></a>

## PartName : <code>enum</code>
Part names

**Kind**: global enum  
<a name="CompatiblePart"></a>

## CompatiblePart : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the part |
| quantity | <code>number</code> | The number of times this type of part is fitted on each engine |
| cost | <code>number</code> | The part's price (in CR) |

<a name="EngineSpecs"></a>

## EngineSpecs : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| power | <code>number</code> | The engine's peak power (in HP) |
| torque | <code>number</code> | The engine's peak torque (in N-m) |
| gearbox | <code>string</code> | The name of the compatible gearbox |

<a name="Engine"></a>

## Engine : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the engine |
| imgUrl | <code>string</code> | The url of the engine's image |
| specs | [<code>EngineSpecs</code>](#EngineSpecs) | The engine's specifications |
| compatibleParts | [<code>Array.&lt;CompatiblePart&gt;</code>](#CompatiblePart) | The parts that are compatible with the engine |

<a name="SelectedPart"></a>

## SelectedPart : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the part |
| quantity | <code>number</code> | The number of times this type of part is fitted on each engine |

<a name="TuningPart"></a>

## TuningPart : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the part |
| cost | <code>number</code> | The part's price (in CR) |
| boost | <code>number</code> | The part's boost increase |
| costToBoost | <code>number</code> | The part's cost to boost ratio - CR / Boost |

<a name="CompareFunction"></a>

## CompareFunction ⇒ <code>number</code>
**Kind**: global typedef  

| Param | Type |
| --- | --- |
| event | <code>React.ChangeEvent</code> | 

