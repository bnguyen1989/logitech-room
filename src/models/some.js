const attrArr = api.configurator.getAttributes();
const attrState = api.configurator.getAttributeState();
const player = api.enableApi('player');
const orgId = player.orgId;
window.tkdatatables = window.tkdatatables || {};
const triggeredByAttr = [];
debugger
//check to see which attribute change triggers the update
attrArr.forEach((attr) => {
  if (api.cache.attrValCache) {
    const attrValue = api.configurator.configuration[attr.name].hasOwnProperty(
      'assetId'
    )
      ? api.configurator.configuration[attr.name].assetId
      : api.configurator.configuration[attr.name];
    if (api.cache.attrValCache[attr.name] !== attrValue) {
      // api.cache.attrValCache[attr.name]  === 'undefined', only when loading the configurator, because the cache is not created

      if (typeof api.cache.attrValCache[attr.name] !== 'undefined') {
        triggeredByAttr.push(attr.name);
      }
      api.cache.attrValCache[attr.name] = attrValue;
    }
  } else {
    api.cache.attrValCache = {};
  }
});
console.log('triggeredByAttr is', triggeredByAttr, triggeredByAttr.length);

// fetch dataTable Threekit
const fetchAll = async (endpoint, keyword, orgId) => {
  const res = await player.getStore().callApi({
    url: `${endpoint}?orgId=${orgId}&all=true`,
  });

  return res[keyword];
};

// Loading and saving a data table to a global window object relative tableId
async function loadDatatableRowsToCache(tableId) {
  const dtUrl = `${window.threekitconf.datatablesApiRoot}/datatables/${tableId}/rows`;

  if (!window.tkdatatables[tableId]) {
    const res = await fetchAll(dtUrl, 'rows', orgId);

    if (!res || !res.length) console.error(`No table result for ${tableId}!`);
    else window.tkdatatables[tableId] = res;
  }
}

// Get the metadata of the current asset where this script is running 
function getMetadataValue(name) {
  return api.configurator.metadata[name];
}


//function to get an Asset attribute
function getAssetAttribute(name) {
  return attrArr.find((attr) => attr.name === name && attr.type === 'Asset');
}

function getAttribute(name) {
  //check if the attribute is an asset type of attribute.
  const attr_asset = attrArr.find(
    (attr) => attr.name === name && attr.type === 'Asset'
  );
  if (attr_asset) return attr_asset;
  const attr_str = attrArr.find(
    (attr) => attr.name === name && attr.type === 'String'
  );
  if (attr_str) return attr_str;

  return '';
}

//function to get the selected value of an attribute
function getSelectedValue(attrName) {
  const selectedItem = api.configurator.configuration[attrName];
  if (selectedItem && selectedItem.hasOwnProperty('assetId')) {
    const theAttr = getAssetAttribute(attrName);
    return selectedItem && selectedItem.assetId
      ? theAttr.values.find((value) => value.assetId === selectedItem.assetId)
      : '';
  } else return selectedItem;
}

//Rule library:
//rule_micPod_micMount_optional() //If no mic Pod hide mic mount, if there's mic pod selected pre-select mic mount qty_micmount= qty_micpod
//rule_micPodQty_sight() //If sight is selected replace 1 mic pod
//rule_micPod_micPodExt_optional()//If Mic is NOT selected, cable doesn't show, if Mic is selected cable is pre-selected but optional
//rule_micPod_micPodHub_required()//If 2 Mics are selected but no Mount, Hub is required
//rule_tapQty_tapIp()//If it's Tap IP as the meeting controler the max qty is 10 intead of 1. This also applis to Tap Mount


//When the Room Meeting Controller is Logitech Tap IP allow for up to 10
function rule_tapQty10_tapIp() {
  const meetingControllerAttrName_str = 'Room Meeting Controller';
  const meetingControllerQtyAttr_str = 'Qty - Meeting Controller';

  const selectedMeetingController = getSelectedValue(
    meetingControllerAttrName_str
  );
  if (selectedMeetingController.name === 'Logitech Tap IP') {
    const attribute = getAttribute(meetingControllerQtyAttr_str);
    const attributeValuesArr = attribute
      ? attrState[attribute.id].values
      : undefined;
    if (attributeValuesArr) {
      attributeValuesArr.forEach((option) => {
        if (Number(option.value) <= 10) {
          option.visible = true;
        }
      });
      api.configurator.setAttributeState(attribute.id, {
        values: attributeValuesArr,
      });
    }
  }
}

async function validateOptionFromDatarows(
  localeTagStr,
  rows,
  tableColName,
  theAttrId,
  theAttrValuesArr,
  leadingSpecCharForDefault = '*' // - Symbol of the default value 
) {
  const optionNames = [],
    attrSpec = {
      attrType: 'Asset',
      allowBlank: false,
      validOptionNames: [],
      validOptionIds: [],
    };
  for (let i = 0; i < rows.length; i++) {
    const rowValue = rows[i].value[tableColName].trim();
    if (rowValue) {
      if (rowValue.indexOf(leadingSpecCharForDefault) == 0) {
        const dfOption = rowValue.substring(1);
        if (dfOption) {
          if (optionNames.indexOf(dfOption) < 0) optionNames.push(dfOption);
          attrSpec.defaultValue = dfOption;
          if (dfOption === 'None') attrSpec.allowBlank = true;
        }
      } else {
        if (i === 0) attrSpec.defaultValue = rowValue;
        if (optionNames.indexOf(rowValue) < 0) optionNames.push(rowValue);
        if (rowValue === 'None') attrSpec.allowBlank = true;
      }
    }
  }


  const selectedValue = getSelectedValue(tableColName);

  const selectedValue_str = selectedValue
    ? selectedValue.hasOwnProperty('assetId')
      ? selectedValue.assetId
      : selectedValue
    : 'None';
  if (theAttrValuesArr) {
    theAttrValuesArr.forEach((option) => {
      //Only show option when it's in the datatable
      if (
        (optionNames.includes(option.name) || //for asset type of attribute
          optionNames.includes(option.value)) && //for string type of attribute
        (!option.tags || option.tags.includes(localeTagStr)) // for asset type of attribute it has the correct locale tag
      ) {
        option.visible = true;
        attrSpec.validOptionNames.push(option.name || option.value);
        attrSpec.validOptionIds.push(option.assetId || option.value);
        attrSpec.attrType = option.assetId ? 'Asset' : 'String';
      } else {
        option.visible = false;
        if (
          selectedValue_str &&
          (selectedValue_str === option.assetId ||
            selectedValue_str === option.value)
        ) {
          attrSpec.preInvalid = option.assetId || option.value;
        }
      }

      //store default value's assetId
      if (attrSpec.defaultValue === 'None') {
        attrSpec.defaultValue = '';
      } else if (
        attrSpec.defaultValue === option.name //for asset type of attribute
      ) {
        attrSpec.defaultValue = option.assetId;
      }
    });
    api.configurator.setAttributeState(theAttrId, {
      values: theAttrValuesArr,
    });
  }

  return attrSpec;
}

async function validateAttributesWithDatatable(
  localeTagStr,
  tableId,
  leadingSpecCharForDefault = '*',
  skipColumns = [],
  attrSequenceArr = [],
  currentIndexInSequence = -1
) {
  if (currentIndexInSequence >= attrSequenceArr.length) return undefined;
  await loadDatatableRowsToCache(tableId);
  const rows = window.tkdatatables[tableId];
  let attributeName_arr = [],
    attrSpec_obj = {};
  if (rows && rows[0]) {
    for (let attrName in rows[0].value) {
      if (skipColumns.indexOf(attrName) < 0) {
        attributeName_arr.push(attrName);
      }
    }
  }

  let datarows = rows;
  //When there is attrSequence defined and user starts to select options from the attributes, shrink the options based on user selection.
  if (currentIndexInSequence > -1 && attrSequenceArr.length > 0) {
    for (let i = 0; i <= currentIndexInSequence; i++) {
      const selectedValue = getSelectedValue(attrSequenceArr[i]);

      const selectedValue_str = selectedValue
        ? selectedValue.hasOwnProperty('assetId')
          ? selectedValue.name
          : selectedValue
        : 'None';

      datarows = datarows.filter(
        (row) =>
          row.value[attrSequenceArr[i]] === selectedValue_str ||
          row.value[attrSequenceArr[i]] ===
            leadingSpecCharForDefault + selectedValue_str
      );
    }
    attributeName_arr = attrSequenceArr.slice(currentIndexInSequence + 1);
  }

  await Promise.all(
    attributeName_arr.map(async (attrName) => {
      const attribute = getAttribute(attrName);
      // Looking for the appropriate attributes in the State Threekit attr
      const attributeValuesArr = attribute
        ? attrState[attribute.id].values
        : undefined;

      const attrSpec = await validateOptionFromDatarows(
        localeTagStr,
        datarows,
        attrName,
        attribute.id,
        attributeValuesArr,
        leadingSpecCharForDefault
      );
      attrSpec_obj[attrName] = attrSpec;
    })
  );

  return attrSpec_obj;
}

//When attribute doesn't allow blank and only one option available, just set the value to the only option
//parameter validatedAttrSpec needs to be in the format of attrSpec_obj returned from function validateAttributesWithDatatable()
function forceSetOption(validatedAttrSpec, setDefaults = false) {
  if (!validatedAttrSpec) return undefined;
  const setConfig_obj = {};
  const validatedAttrNames = Object.keys(validatedAttrSpec);

  for (let i = 0; i < validatedAttrNames.length; i++) {
    const attrName = validatedAttrNames[i];
    const currentSelectedValue = getSelectedValue(attrName);
    const currentSelectedValue_str = currentSelectedValue
      ? currentSelectedValue.hasOwnProperty('assetId')
        ? currentSelectedValue.assetId
        : currentSelectedValue
      : '';
    if (setDefaults) {
      setConfig_obj[attrName] =
        validatedAttrSpec[attrName].attrType === 'Asset'
          ? {
              assetId: validatedAttrSpec[attrName].defaultValue,
            }
          : validatedAttrSpec[attrName].defaultValue;
    }

    if (
      //When not allow blank and only one option available set it to that option if it's currently not that value
      (!validatedAttrSpec[attrName].allowBlank &&
        validatedAttrSpec[attrName].validOptionIds &&
        validatedAttrSpec[attrName].validOptionIds.length === 1 &&
        currentSelectedValue_str !==
          validatedAttrSpec[attrName].validOptionIds[0]) ||
      //When allow blank and only one option is blank, set it to blank if it's currently not blank
      (validatedAttrSpec[attrName].allowBlank &&
        validatedAttrSpec[attrName].validOptionIds.length === 0 &&
        currentSelectedValue_str)
    ) {
      const setToVal = validatedAttrSpec[attrName].validOptionIds[0]
        ? validatedAttrSpec[attrName].validOptionIds[0]
        : '';
      setConfig_obj[attrName] =
        validatedAttrSpec[attrName].attrType === 'Asset'
          ? {
              assetId: setToVal,
            }
          : setToVal;
    }
  }
  console.log('setConfig_obj is', setConfig_obj);
  return setConfig_obj;
}

//This function finds the single matching row in level1 datatable, when no match is found return undefined.
async function findLevel2Row(
  level1TableId,
  attrSequenceArr,
  leadingSpecCharForDefault = '*'
) {
  if (attrSequenceArr.length < 1) return undefined;

  const selectedValueArr = [];
  for (let i = 0; i < attrSequenceArr.length; i++) {
    const selectedValue = getSelectedValue(attrSequenceArr[i]);
    const selectedValue_str = selectedValue
      ? selectedValue.hasOwnProperty('assetId')
        ? selectedValue.name
        : selectedValue
      : 'None';
    selectedValueArr.push(selectedValue_str);
  }

  await loadDatatableRowsToCache(level1TableId);
  const rows = window.tkdatatables[level1TableId];
  console.log('rows = ',{attrSequenceArr,rows});
  for (let row of rows) {
    let found_counter = 0;
    attrSequenceArr.forEach((attrName, attrIndex) => {
      if (row.value[attrName]) {
        const rowValue = row.value[attrName].trim();
        if (
          rowValue === selectedValueArr[attrIndex] ||
          rowValue === leadingSpecCharForDefault + selectedValueArr[attrIndex]
        )
          found_counter++;
      }
    });
    
    if (found_counter === attrSequenceArr.length) return row;
  }
  return undefined;
}

//Wrapper function that level 1 attributes can be validated recursively to make sure going back to previous step will affect following attributes
async function validateLevel1Attr(
  localeTagStr,
  level1TableId,
  leadingSpecCharForDefault,
  skipColumns,
  level1AttrSequenceArr,
  currentIndexInLevel1Sequence
) {
  const setConfig_obj = await validateAttributesWithDatatable(
    localeTagStr,
    level1TableId,
    leadingSpecCharForDefault,
    skipColumns,
    level1AttrSequenceArr,
    currentIndexInLevel1Sequence
  ).then((validatedAttrSpec) => forceSetOption(validatedAttrSpec));
  const forcedSetAttrs = setConfig_obj ? Object.keys(setConfig_obj) : [];
  console.log('forcedSetAttrs',forcedSetAttrs);
  if (forcedSetAttrs.length > 0) {
    //console.log('setConfig_obj is', setConfig_obj);
    api.configurator.setConfiguration(setConfig_obj);
  } else {
    if (level1AttrSequenceArr[currentIndexInLevel1Sequence + 1]) {
      const nextInSequenceSelectedValue = getSelectedValue(
        level1AttrSequenceArr[currentIndexInLevel1Sequence + 1]
      );
      if (nextInSequenceSelectedValue) {
        validateLevel1Attr(
          localeTagStr,
          level1TableId,
          leadingSpecCharForDefault,
          skipColumns,
          level1AttrSequenceArr,
          currentIndexInLevel1Sequence + 1
        );
      }
    }
  }
}

async function main() {
  const localeTagStr = 'locale_US'; //will be dynamic based on the attribute 'Room Locale', now just hardcode to be US.

  ////* 1st - filter for the level1 attributes: Service, Deployment Mode, Camera, Compute
  const level1TableMtdt = '_datatable_configOptions_level1';
  const level1TableId = getMetadataValue(level1TableMtdt);
  const leadingSpecCharForDefault = '*';
  const skipColumns = ['level2datatableId', 'attrRules'];
  const level1SequenceStr = getMetadataValue('_level1_attributes_sequence');

  const level1AttrSequenceArr = level1SequenceStr
    ? level1SequenceStr.split(',').map((aStr) => aStr.trim())
    : [];



  const currentIndexInLevel1Sequence = level1AttrSequenceArr.indexOf(
    triggeredByAttr[0]
  );
  const firstLevel1AttrSelectedValue = getSelectedValue(
    level1AttrSequenceArr[0]
  );

 debugger
  if (
    currentIndexInLevel1Sequence > -1 || //when user is configuring the level 1 attribute
    !firstLevel1AttrSelectedValue //when it's the initial state
  ) {
    await validateLevel1Attr(
      localeTagStr,
      level1TableId,
      leadingSpecCharForDefault,
      skipColumns,
      level1AttrSequenceArr,
      currentIndexInLevel1Sequence
    );
  }

  ////* 2nd - based on selection from level1 attributes to find level2 datatable to further validate level2 attributes
  const level2row = await findLevel2Row(
    level1TableId,
    level1AttrSequenceArr,
    leadingSpecCharForDefault
  );

  if (!level2row || !level2row.value) return; //May need to set a flag for UI to know that it can't pass this step unless level1 attributes are all selected.

  const level2datatableId = level2row.value[skipColumns[0]];
  const attrRulesStr = level2row.value[skipColumns[1]];
  let setLevel2Default_flag = false;
  if (
    !api.cache.level2datatableId ||
    api.cache.level2datatableId !== level2datatableId
  ) {
    setLevel2Default_flag = true;
    api.cache.level2datatableId = level2datatableId;
  }
  const setConfig_obj = await validateAttributesWithDatatable(
    localeTagStr,
    level2datatableId,
    leadingSpecCharForDefault
  ).then((validatedAttrSpec) =>
    forceSetOption(validatedAttrSpec, setLevel2Default_flag)
  );
  const forcedSetAttrs = setConfig_obj ? Object.keys(setConfig_obj) : [];
  if (forcedSetAttrs.length > 0) {
    //console.log('setConfig_obj is', setConfig_obj);
    api.configurator.setConfiguration(setConfig_obj);
  }

  ////*3rd call the rule(s) based on what's selected in the level1 datatable
  const attrRulesArr = attrRulesStr
    ? attrRulesStr.split(';').map((aStr) => aStr.trim())
    : [];
console.log('attrRulesArr',attrRulesArr);
  //right now just use hardcoded keyword 'tapQty_tapIp' for POC, later on these should be stored in a datatable and loop through all keywords
  if (attrRulesArr.indexOf('tapQty_tapIp') > -1) {
    rule_tapQty10_tapIp();
  }

  ////*4th - check if there's any attributes left that's not validated by level1&level2 datatables.
  //If there is, set that attribute to '' and hide it.
  //Also hide the attributes that are forced set to blank

  ////*5th - get the current configuration save in an attribute
}

main();
