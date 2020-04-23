import React, { useReducer, useCallback } from "react";
import Map, {
  SET_SELECTED_INSTITUTION_ACTION,
  UNSET_SELECTED_INSTITUTION_ACTION,
} from "../components/Map";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import Chip from "@material-ui/core/Chip";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Card, { assayOptions } from "./Card";
import CountrySelect from "./CountrySelect";
import TextField from "@material-ui/core/TextField";
import _debounce from "lodash/debounce";
import _flatten from "lodash/flatten";
import _uniq from "lodash/uniq";
import CircularProgress from "@material-ui/core/CircularProgress";
import InvestigatorContactForm from "./InvestigatorContactForm";
import SmartListItem from "./SmartListItem";
import "typeface-roboto";
import { MapDatum, ListDatum } from "../types";

const assayNames = assayOptions.map(({ name }) => name);
const studyListStyleName = "studyList";

const useMaterialStyles = makeStyles(() => ({
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  dropdownFormControl: {
    padding: "0 0.625rem",
    borderWidth: "1px",
    borderStyle: "solid",
    display: "block",
    minHeight: "65px",
  },
  dropdownSelect: {
    "&&:focus": {
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
  },
  checkboxFormControl: {
    padding: "0.2rem 0.625rem",
    borderWidth: "1px",
    borderStyle: "solid",
    display: "block",
  },
  countrySelector: {
    padding: "0 0.625rem",
    display: "block",
    marginTop: "1rem",
  },
  keywordSearch: {
    display: "block",
    marginTop: "0.5rem",
  },
  [studyListStyleName]: {
    marginTop: 0,
    marginLeft: 0,
  },
  keywordSearchOutline: {
    borderColor: "rgb(51, 51, 51)",
    borderRadius: 0,
  },
}));

export const SET_FORM_STATE = "SET_FORM_STATE";

const retrospectiveStateName = "isRetrospectiveSelected";
const prospectiveStateName = "isProspectiveSelected";
const wesStateName = "isWesSelected";
const wgsStateName = "isWgsSelected";
const gwasStateName = "isGwasSelected";
const assaysStateName = "assays";
const researchCategoriesStateName = "researchCategories";
const selectedCountryStateName = "selectedCountry";
const keywordSearchStateName = "keywordSearch";
export const contactFormOpenStateName = "isContactFormOpen";

export interface State {
  selectedId: string | undefined;
  [retrospectiveStateName]: boolean;
  [prospectiveStateName]: boolean;
  [wesStateName]: boolean;
  [wgsStateName]: boolean;
  [gwasStateName]: boolean;
  [assaysStateName]: string[];
  [researchCategoriesStateName]: string[];
  [selectedCountryStateName]: string | undefined;
  [keywordSearchStateName]: string;
  [contactFormOpenStateName]: boolean;
}
const initialState: State = {
  selectedId: undefined,
  [retrospectiveStateName]: false,
  [prospectiveStateName]: false,
  [wesStateName]: false,
  [wgsStateName]: false,
  [gwasStateName]: false,
  [assaysStateName]: [],
  [researchCategoriesStateName]: [],
  [selectedCountryStateName]: undefined,
  [keywordSearchStateName]: "",
  [contactFormOpenStateName]: false,
};

interface SetStateAction<K extends keyof State> {
  type: typeof SET_FORM_STATE;
  payload: {
    name: K;
    value: State[K];
  };
}

export type Action<K extends keyof State> =
  | SetStateAction<K>
  | {
      type: typeof UNSET_SELECTED_INSTITUTION_ACTION;
    }
  | {
      type: typeof SET_SELECTED_INSTITUTION_ACTION;
      payload: {
        id: string;
      };
    };

const reducer = <K extends keyof State>(
  state: State,
  action: Action<K>
): State => {
  switch (action.type) {
    case SET_SELECTED_INSTITUTION_ACTION:
      return {
        ...state,
        selectedId: action.payload.id,
      };
    case UNSET_SELECTED_INSTITUTION_ACTION:
      return {
        ...state,
        selectedId: undefined,
      };
    case SET_FORM_STATE:
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    default:
      return state;
  }
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

interface Props {
  title: string;
  mapData: MapDatum[];
  listData: ListDatum[];
}

const Partners = ({ title, mapData, listData }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const materialStyles = useMaterialStyles();

  let filteredIds: string[];
  if (listData === undefined) {
    filteredIds = [];
  } else {
    let filteredData = listData;
    if (state[retrospectiveStateName] === true) {
      filteredData = filteredData.filter(
        ({ retrospective }) => retrospective === true
      );
    }
    if (state[prospectiveStateName] === true) {
      filteredData = filteredData.filter(
        ({ prospective }) => prospective === true
      );
    }
    if (state[wesStateName] === true) {
      filteredData = filteredData.filter(({ wes }) => wes === true);
    }
    if (state[wgsStateName] === true) {
      filteredData = filteredData.filter(({ wgs }) => wgs === true);
    }
    if (state[gwasStateName] === true) {
      filteredData = filteredData.filter(
        ({ genotyping }) => genotyping === true
      );
    }
    state[assaysStateName].forEach((assayName) => {
      filteredData = filteredData.filter(
        (elem) =>
          "assaysPlanned" in elem && elem.assaysPlanned.includes(assayName)
      );
    });
    state[researchCategoriesStateName].forEach((category) => {
      filteredData = filteredData.filter(
        (elem) =>
          "researchCategory" in elem && elem.researchCategory.includes(category)
      );
    });
    const selectedCountry = state[selectedCountryStateName];
    if (selectedCountry !== undefined) {
      filteredData = filteredData.filter(({ country }) => {
        const thisCountryString = country.toLowerCase().replace(/\s+/g, "");
        const selectedCountryString = selectedCountry
          .toLowerCase()
          .replace(/\s+/g, "");
        return (
          thisCountryString.includes(selectedCountryString) ||
          selectedCountryString.includes(thisCountryString)
        );
      });
    }
    if (state[keywordSearchStateName] !== "") {
      filteredData = filteredData.filter((elem) =>
        elem.allText.includes(state[keywordSearchStateName])
      );
    }

    filteredIds = filteredData.map(({ id }) => id);
  }

  const showContactForm = useCallback(() => {
    const action: SetStateAction<typeof contactFormOpenStateName> = {
      type: SET_FORM_STATE,
      payload: {
        name: contactFormOpenStateName,
        value: true,
      },
    };
    dispatch(action);
  }, []);

  const studyTypeElem = (
    <FormControl
      component="fieldset"
      classes={{
        root: materialStyles.checkboxFormControl,
      }}
    >
      <FormLabel component="legend"> Study Type</FormLabel>
      <FormGroup row={true}>
        <FormControlLabel
          control={
            <Checkbox
              checked={state[retrospectiveStateName]}
              onChange={(event) => {
                const action: SetStateAction<typeof retrospectiveStateName> = {
                  type: SET_FORM_STATE,
                  payload: {
                    name: retrospectiveStateName,
                    value: event.target.checked,
                  },
                };
                dispatch(action);
              }}
            />
          }
          label="Retrospective"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={state[prospectiveStateName]}
              onChange={(event) =>
                dispatch({
                  type: SET_FORM_STATE,
                  payload: {
                    name: prospectiveStateName,
                    value: event.target.checked,
                  },
                })
              }
            />
          }
          label="Prospective"
        />
      </FormGroup>
    </FormControl>
  );

  const assaysPlannedElem = (
    <FormControl
      component="fieldset"
      classes={{
        root: materialStyles.dropdownFormControl,
      }}
    >
      <FormLabel component="legend">Assays planned</FormLabel>
      <FormGroup>
        <Select
          id="partners-assays-planned"
          multiple={true}
          value={state[assaysStateName]}
          classes={{
            select: materialStyles.dropdownSelect,
          }}
          onChange={(event) => {
            const action: SetStateAction<typeof assaysStateName> = {
              type: SET_FORM_STATE,
              payload: {
                name: assaysStateName,
                value: event.target.value as string[],
              },
            };
            dispatch(action);
          }}
          input={<Input disableUnderline={true} />}
          renderValue={(selected) => (
            <div className={materialStyles.chips}>
              {(selected as string[]).map((value) => (
                <Chip
                  key={value}
                  label={value}
                  className={materialStyles.chip}
                />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {assayNames.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormGroup>
    </FormControl>
  );

  const geneticAnalysisElem = (
    <FormControl
      component="fieldset"
      classes={{
        root: materialStyles.checkboxFormControl,
      }}
    >
      <FormLabel component="legend">Genetic analysis</FormLabel>
      <FormGroup row={true}>
        <FormControlLabel
          control={
            <Checkbox
              checked={state[gwasStateName]}
              onChange={(event) => {
                const action: SetStateAction<typeof gwasStateName> = {
                  type: SET_FORM_STATE,
                  payload: {
                    name: gwasStateName,
                    value: event.target.checked,
                  },
                };
                dispatch(action);
              }}
            />
          }
          label="GWAS"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={state[wesStateName]}
              onChange={(event) => {
                const action: SetStateAction<typeof wesStateName> = {
                  type: SET_FORM_STATE,
                  payload: {
                    name: wesStateName,
                    value: event.target.checked,
                  },
                };
                dispatch(action);
              }}
            />
          }
          label="WES"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={state[wgsStateName]}
              onChange={(event) => {
                const action: SetStateAction<typeof wgsStateName> = {
                  type: SET_FORM_STATE,
                  payload: {
                    name: wgsStateName,
                    value: event.target.checked,
                  },
                };
                dispatch(action);
              }}
            />
          }
          label="WGS"
        />
      </FormGroup>
    </FormControl>
  );

  let researchCategoriesElem;
  if (listData === undefined) {
    researchCategoriesElem = null;
  } else {
    const researchCategoryNames = _uniq(
      _flatten(listData.map(({ researchCategory }) => researchCategory)).filter(
        (elem) => !!elem
      )
    );
    researchCategoriesElem = (
      <FormControl
        component="fieldset"
        classes={{
          root: materialStyles.dropdownFormControl,
        }}
      >
        <FormLabel component="legend">Research Categories</FormLabel>
        <FormGroup>
          <Select
            multiple={true}
            value={state[researchCategoriesStateName]}
            disableUnderline={true}
            classes={{
              select: materialStyles.dropdownSelect,
            }}
            onChange={(event) => {
              const action: SetStateAction<typeof researchCategoriesStateName> = {
                type: SET_FORM_STATE,
                payload: {
                  name: researchCategoriesStateName,
                  value: event.target.value as string[],
                },
              };
              dispatch(action);
            }}
            input={<Input />}
            renderValue={(selected) => (
              <div className={materialStyles.chips}>
                {(selected as string[]).map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    className={materialStyles.chip}
                  />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {researchCategoryNames.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormGroup>
      </FormControl>
    );
  }

  const onKeywordSearchChange = useCallback(
    _debounce((value: string) => {
      const action: SetStateAction<typeof keywordSearchStateName> = {
        type: SET_FORM_STATE,
        payload: {
          name: keywordSearchStateName,
          value: value.toLowerCase(),
        },
      };
      dispatch(action);
    }, 250),
    []
  );

  const keywordSearchElem = (
    // @ts-ignore need to look deeper into Material UI's type definition to see why this errors out.
    <FormControl
      comnponent="fieldset"
      classes={{ root: materialStyles.keywordSearch }}
    >
      <TextField
        id="standard-basic"
        label="Keyword"
        variant="outlined"
        fullWidth={true}
        InputProps={{
          classes: {
            notchedOutline: materialStyles.keywordSearchOutline,
          },
        }}
        onChange={(event) => onKeywordSearchChange(event.target.value)}
      />
    </FormControl>
  );

  let listElem: React.ReactElement<any>, card: React.ReactElement<any> | null;
  if (listData === undefined) {
    listElem = (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </div>
    );
    card = null;
  } else {
    const filteredData = listData.filter(({ id }) => filteredIds.includes(id));
    const listItems = filteredData.map(({ id, study }) => (
      <SmartListItem
        key={id}
        id={id}
        study={study}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
    ));

    const studyListHeadingText =
      listData.length === filteredData.length
        ? `Registered studies (${listData.length})`
        : `Matching studies (${filteredData.length})`;
    listElem = (
      <>
        <div className="title is-4">{studyListHeadingText} </div>
        <div style={{ maxHeight: "36vh", overflowY: "auto" }}>
          <List dense={true} component="div">
            {listItems}
          </List>
        </div>
      </>
    );

    if (
      state.selectedId === undefined ||
      filteredData.map(({ id }) => id).includes(state.selectedId) === false
    ) {
      // Do not show card if there's no selected study or if  the selected study has been filtered out:
      card = (
        <div className="section" style={{ marginTop: 0, paddingTop: 0 }}>
          <div className="card">
            <div className="card-header" style={{ minHeight: "5rem" }}>
              <div className="card-header-title">
                <div className="title is-4"> Please select a study </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      const cardInfo = listData.find(({ id }) => id === state.selectedId)!;
      card = (
        <div className="section" style={{ marginTop: 0, paddingTop: 0 }}>
          <div className="title is-4">Study details</div>
          <Card cardInfo={cardInfo} showContactForm={showContactForm} />
        </div>
      );
    }
  }

  let mapElem: React.ReactElement<any>;
  if (mapData === undefined) {
    mapElem = (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </div>
    );
  } else {
    const filteredData = mapData.filter(({ id }) => filteredIds.includes(id));
    mapElem = (
      <Map
        dispatchMessageToParent={dispatch}
        mapData={mapData}
        filteredData={filteredData}
        selected={state.selectedId}
      />
    );
  }

  return (
    <div className="content">
      <div>
        <h1
          className="has-text-weight-bold is-size-1"
          style={{
            boxShadow: "0.5rem 0 0 #f40, -0.5rem 0 0 #f40",
            backgroundColor: "#142166",
            color: "white",
            padding: "1rem",
          }}
        >
          {title}
        </h1>
      </div>
      <section className="section section--gradient" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section" style={{ paddingTop: 0 }}>
            <div className="title is-4">Find studies</div>
            <div className="columns">
              <div className="column is-one-third">{studyTypeElem}</div>
              <div className="column is-one-third">{assaysPlannedElem}</div>
              <div className="column is-one-third">
                <CountrySelect
                  onChange={(_event, value: string) => {
                    const dispatchedValue = value === "" ? undefined : value;
                    const action: SetStateAction<typeof selectedCountryStateName> = {
                      type: SET_FORM_STATE,
                      payload: {
                        name: selectedCountryStateName,
                        value: dispatchedValue,
                      },
                    };
                    dispatch(action);
                  }}
                />
              </div>
            </div>
            <div className="columns">
              <div className="column is-one-third">{geneticAnalysisElem}</div>
              <div className="column is-one-third">
                {researchCategoriesElem}
              </div>
              <div className="column is-one-third">{keywordSearchElem}</div>
            </div>
          </div>
          <div className="section">
            <div className="columns">
              <div className="column is-one-third">{listElem}</div>
              <div className="column is-two-thirds">{mapElem}</div>
            </div>
          </div>
          {card}
          <InvestigatorContactForm
            selectedId={state.selectedId}
            isOpen={state[contactFormOpenStateName]}
            dispatchMessageToParent={dispatch}
          />
        </div>
      </section>
    </div>
  );
};

export default Partners;