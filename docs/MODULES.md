## Modules

<dl>
<dt><a href="#module_common">common</a></dt>
<dd></dd>
<dt><a href="#module_contexts">contexts</a></dt>
<dd></dd>
<dt><a href="#module_customEvents">customEvents</a></dt>
<dd></dd>
</dl>

<a name="module_common"></a>

## common

* [common](#module_common)
    * [.engines](#module_common.engines) : <code>Engine</code>
    * [.compareBasedOnName(a, b)](#module_common.compareBasedOnName)

<a name="module_common.engines"></a>

### common.engines : <code>Engine</code>
The list of all engines included in the app.

**Kind**: static constant of [<code>common</code>](#module_common)  
<a name="module_common.compareBasedOnName"></a>

### common.compareBasedOnName(a, b)
Compares two objects based on their name property.

**Kind**: static method of [<code>common</code>](#module_common)  

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
| currentEngine | <code>Nullable.&lt;Engine&gt;</code> | 
| selectedParts | <code>Array.&lt;SelectedPart&gt;</code> | 

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
**Kind**: static class of [<code>customEvents</code>](#module_customEvents)  
**Extends**: <code>CustomEvent</code>  
**See**

- https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
- https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
- https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
A [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) for clearing the [selectedParts](#module_contexts.CalculatorContext).

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
| newVal | <code>Array.&lt;SelectedPart&gt;</code> | The new value to replace the previous [selectedParts](#module_contexts.CalculatorContext) |

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
| newVal | <code>Nullable.&lt;Engine&gt;</code> | The new value to replace the previous [currentEngine](#module_contexts.CalculatorContext) |

<a name="EngineName"></a>

## EngineName : <code>enum</code>
Engine names

**Kind**: global enum  
<a name="PartName"></a>

## PartName : <code>enum</code>
Part names

**Kind**: global enum  
