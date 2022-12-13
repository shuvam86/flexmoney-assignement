import {
  AppBar,
  Backdrop,
  Button,
  CircularProgress,
  makeStyles,
  Paper,
  Toolbar,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import { useState } from "react";
import TextField from "./components/TextField";
import messages from "./constants/Messages";
import { formatDateAndTime } from "./helpers/DateHelpers";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
  },
  mainContainer: {
    display: "flex",
    alignItems: "flex-start",
    margin: "2rem 1.5rem",
  },
  paperRoot: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "1rem",
  },
  cardDetailsContainer: {
    display: "flex",
    flexDirection: "column",
  },
  row1Container: {
    display: "flex",
    flexDirection: "column",
    margin: "0.5rem 0",
    alignItems: "flex-start",
  },
  labelContainer: {
    margin: "0.25rem 0",
  },
  label: {
    fontSize: "0.75rem",
  },
  errorContainer: {
    margin: "0.25rem 0",
  },
  errorText: {
    fontSize: "0.5rem",
    color: theme.palette.error.main,
  },
  cardNumberContainer: {
    display: "flex",
    alignItems: "center",
  },
  cardNumberPartLeftContainer: {
    marginRight: "0.5rem",
  },
  cardNumberPartContainer: {
    margin: "0 0.5rem",
  },
  cardNumberPartRightContainer: {
    marginLeft: "0.5rem",
  },
  row2Container: {
    display: "flex",
    alignItems: "center",
    margin: "0.5rem 0",
    width: "100%",
    justifyContent: "space-between",
  },
  expiryContainer: {
    display: "flex",
    flexDirection: "column",
  },
  expiryDetailsContainer: {
    display: "flex",
    alignItems: "center",
  },
  expiryMonthContainer: {
    marginRight: "0.5rem",
  },
  slashContainer: {
    margin: "0 0.5rem",
  },
  slashLabel: {
    fontSize: "1rem",
    fontWeight: "400",
  },
  expiryYearContainer: {
    marginLeft: "0.5rem",
  },
  cvvContainer: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    alignItems: "flex-end",
  },
  nameContainer: {
    margin: "0.5rem 0",
    display: "flex",
    flexDirection: "column",
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "flex-end",
    margin: "0.5rem 0",
  },
  resetButtonContainer: {
    marginRight: "0.5rem",
  },
  submitButtonContainer: {
    marginLeft: "0.5rem",
  },
  successContainer: {
    display: "flex",
    flexDirection: "column",
    margin: "0.5rem 0",
  },
  successLabel: {
    fontSize: "1rem",
    color: theme.palette.success.main,
  },
  successDescription: {
    fontSize: "0.5rem",
  },
  failureLabel: {
    fontSize: "1rem",
    color: theme.palette.error.main,
  },
}));

function App() {
  const [cardNum1, setCardNum1] = useState("");
  const [cardNum2, setCardNum2] = useState("");
  const [cardNum3, setCardNum3] = useState("");
  const [cardNum4, setCardNum4] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [successData, setSuccessData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const classes = useStyles();

  function handleCardNum1Change(event) {
    const newText = event.target.value;
    if (/^(\d{1,4})$/.test(newText)) {
      setCardNum1(newText);
    } else if (newText === "") {
      setCardNum1(newText);
    }
  }
  function handleCardNum2Change(event) {
    const newText = event.target.value;
    if (/^(\d{1,4})$/.test(newText)) {
      setCardNum2(newText);
    } else if (newText === "") {
      setCardNum2(newText);
    }
  }
  function handleCardNum3Change(event) {
    const newText = event.target.value;
    if (/^(\d{1,4})$/.test(newText)) {
      setCardNum3(newText);
    } else if (newText === "") {
      setCardNum3(newText);
    }
  }
  function handleCardNum4Change(event) {
    const newText = event.target.value;
    if (/^(\d{1,4})$/.test(newText)) {
      setCardNum4(newText);
    } else if (newText === "") {
      setCardNum4(newText);
    }
  }

  function handleCvvChange(event) {
    const newText = event.target.value;
    if (/^(\d{1,3})$/.test(newText)) {
      setCvv(newText);
    } else if (newText === "") {
      setCvv(newText);
    }
  }

  function handleExpiryMonthChange(event) {
    const newText = event.target.value;
    if (
      /^(0{1})([0-9]{0,1})$/.test(newText) ||
      /^(1{1})([0-2]{0,1})$/.test(newText)
    ) {
      setExpiryMonth(newText);
    } else if (newText === "") {
      setExpiryMonth(newText);
    }
  }

  function handleExpiryYearChange(event) {
    const newText = event.target.value;
    if (/^([0-9]{0,2})$/.test(newText)) {
      setExpiryYear(newText);
    } else if (newText === "") {
      setExpiryYear(newText);
    }
  }

  function handleCardHolderNameChange(event) {
    const newText = event.target.value;
    if (/^([a-zA-Z\s]+)$/.test(newText)) {
      setCardHolderName(newText);
    } else if (newText === "") {
      setCardHolderName(newText);
    }
  }

  function areAllFieldsValid() {
    let cardNumErrorMessage = "";
    let expiryErrorMessage = "";
    let cvvErrorMessage = "";
    let nameErrorMessage = "";
    if (
      cardNum1.length !== 4 ||
      cardNum2.length !== 4 ||
      cardNum3.length !== 4 ||
      cardNum4.length !== 4
    ) {
      cardNumErrorMessage = messages["CardDetails.cardNum.error.not16Digits"];
    }
    const lastDayOfEnteredMonthAndYear = new Date(
      `20${expiryYear}`,
      expiryMonth,
      0
    );

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const lastDayOfCurrentMonthAndYear = new Date(
      currentYear,
      currentMonth + 1,
      0
    );

    if (expiryMonth.length !== 2 || expiryYear.length !== 2) {
      expiryErrorMessage = messages["CardDetails.expiry.error.not2Digits"];
    } else if (
      lastDayOfCurrentMonthAndYear.valueOf() >=
      lastDayOfEnteredMonthAndYear.valueOf()
    ) {
      expiryErrorMessage =
        messages["CardDetails.expiry.error.beforeCurrentDate"];
    }
    if (cvv.length !== 3) {
      cvvErrorMessage = messages["CardDetails.cvv.error.not3Digits"];
    }
    if (cardHolderName.length === 0) {
      nameErrorMessage = messages["CardDetails.cardHolderName.error.nameEmpty"];
    }
    setValidationErrors({
      cardNum: cardNumErrorMessage,
      expiry: expiryErrorMessage,
      cvv: cvvErrorMessage,
      cardHolderName: nameErrorMessage,
    });
    return cardNumErrorMessage.length ||
      expiryErrorMessage.length ||
      cvvErrorMessage.length ||
      nameErrorMessage.length
      ? false
      : true;
  }

  function handleResetClick() {
    setCardNum1('');
    setCardNum2('');
    setCardNum3('');
    setCardNum4('');
    setCvv('');
    setExpiryMonth('');
    setExpiryYear('');
    setCardHolderName('');
    setSuccessData(null);
    setIsError(false);
    setValidationErrors({});
  }

  function handleSubmitClick() {
    if (areAllFieldsValid()) {
      const postBody = {
        cardNo: `${cardNum1}${cardNum2}${cardNum3}${cardNum4}`,
        cvv: +cvv,
        expiryMonth: +expiryMonth,
        expiryYear: +expiryYear,
        name: cardHolderName,
      };
      setLoading(true);
      setIsError(false);
      setSuccessData(null);
      axios({
        method: "POST",
        url: "https://run.mocky.io/v3/0b14a8da-5fc7-4443-8511-53d687399bc9",
        data: postBody,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false,
      })
        .then((res) => {
          setSuccessData(res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          setIsError(true);
          setLoading(false);
        });
    }
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">{messages["Header.heading"]}</Typography>
        </Toolbar>
      </AppBar>
      {loading && (
        <Backdrop open classes={{ root: classes.backdrop }}>
          <CircularProgress />
        </Backdrop>
      )}
      <main className={classes.mainContainer}>
        <Paper classes={{ root: classes.paperRoot }}>
          <div className={classes.cardDetailsContainer}>
            <div className={classes.row1Container}>
              <div className={classes.labelContainer}>
                <Typography variant="h6" classes={{ root: classes.label }}>
                  {messages["CardDetails.cardNum.name"]}
                </Typography>
              </div>
              <div className={classes.cardNumberContainer}>
                <div className={classes.cardNumberPartLeftContainer}>
                  <TextField
                    value={cardNum1}
                    variant="outlined"
                    onChange={handleCardNum1Change}
                    placeholder={messages["CardDetails.cardNum.placeholder"]}
                    InputProps={{ inputProps: { maxLength: 4 } }}
                    required
                    itemWidth={55}
                    error={Boolean(validationErrors.cardNum)}
                    // id="card-num"
                  />
                </div>
                <div className={classes.cardNumberPartContainer}>
                  <TextField
                    value={cardNum2}
                    variant="outlined"
                    onChange={handleCardNum2Change}
                    placeholder={messages["CardDetails.cardNum.placeholder"]}
                    InputProps={{ inputProps: { maxLength: 4 } }}
                    required
                    itemWidth={55}
                    error={Boolean(validationErrors.cardNum)}
                    // id="card-num"
                  />
                </div>
                <div className={classes.cardNumberPartContainer}>
                  <TextField
                    value={cardNum3}
                    variant="outlined"
                    onChange={handleCardNum3Change}
                    placeholder={messages["CardDetails.cardNum.placeholder"]}
                    InputProps={{ inputProps: { maxLength: 4 } }}
                    required
                    itemWidth={55}
                    error={Boolean(validationErrors.cardNum)}
                    // id="card-num"
                  />
                </div>
                <div className={classes.cardNumberPartRightContainer}>
                  <TextField
                    value={cardNum4}
                    variant="outlined"
                    onChange={handleCardNum4Change}
                    placeholder={messages["CardDetails.cardNum.placeholder"]}
                    InputProps={{ inputProps: { maxLength: 4 } }}
                    required
                    itemWidth={55}
                    error={Boolean(validationErrors.cardNum)}
                    // id="card-num"
                  />
                </div>
              </div>
              <div className={classes.errorContainer}>
                <Typography
                  variant="subtitle2"
                  classes={{ root: classes.errorText }}
                >
                  {validationErrors.cardNum}
                </Typography>
              </div>
            </div>

            <div className={classes.row2Container}>
              <div className={classes.expiryContainer}>
                <div className={classes.labelContainer}>
                  <Typography variant="h6" classes={{ root: classes.label }}>
                    {messages["CardDetails.expiry"]}
                  </Typography>
                </div>
                <div className={classes.expiryDetailsContainer}>
                  <div className={classes.expiryMonthContainer}>
                    <TextField
                      value={expiryMonth}
                      variant="outlined"
                      onChange={handleExpiryMonthChange}
                      placeholder={
                        messages["CardDetails.expiryMonth.placeholder"]
                      }
                      InputProps={{ inputProps: { maxLength: 2 } }}
                      required
                      itemWidth={40}
                      error={Boolean(validationErrors.expiry)}
                      // id="expiry-month"
                    />
                  </div>
                  <div className={classes.slashContainer}>
                    <Typography
                      variant="subtitle2"
                      classes={{ root: classes.slashLabel }}
                    >
                      /
                    </Typography>
                  </div>
                  <div className={classes.expiryYearContainer}>
                    <TextField
                      value={expiryYear}
                      variant="outlined"
                      onChange={handleExpiryYearChange}
                      placeholder={
                        messages["CardDetails.expiryYear.placeholder"]
                      }
                      InputProps={{ inputProps: { maxLength: 2 } }}
                      required
                      itemWidth={36}
                      error={Boolean(validationErrors.expiry)}
                      // id="expiry-year"
                    />
                  </div>
                </div>
                <div className={classes.errorContainer}>
                  <Typography
                    variant="subtitle2"
                    classes={{ root: classes.errorText }}
                  >
                    {validationErrors.expiry}
                  </Typography>
                </div>
              </div>

              <div className={classes.cvvContainer}>
                <div>
                  <Typography variant="h6" classes={{ root: classes.label }}>
                    {messages["CardDetails.cvv.name"]}
                  </Typography>
                </div>
                <TextField
                  value={cvv}
                  variant="outlined"
                  onChange={handleCvvChange}
                  placeholder={messages["CardDetails.cvv.placeholder"]}
                  InputProps={{ inputProps: { maxLength: 3 } }}
                  required
                  itemWidth={45}
                  type="password"
                  id="cvv"
                  error={Boolean(validationErrors.cvv)}
                />
                <div className={classes.errorContainer}>
                  <Typography
                    variant="subtitle2"
                    classes={{ root: classes.errorText }}
                  >
                    {validationErrors.cvv}
                  </Typography>
                </div>
              </div>
            </div>

            <div className={classes.nameContainer}>
              <div>
                <Typography variant="h6" classes={{ root: classes.label }}>
                  {messages["CardDetails.cardHolderName.name"]}
                </Typography>
              </div>
              <TextField
                value={cardHolderName}
                variant="outlined"
                onChange={handleCardHolderNameChange}
                placeholder={messages["CardDetails.cardHolderName.placeholder"]}
                required
                align="left"
                id="name"
                error={Boolean(validationErrors.cardHolderName)}
              />
              <div className={classes.errorContainer}>
                <Typography
                  variant="subtitle2"
                  classes={{ root: classes.errorText }}
                >
                  {validationErrors.cardHolderName}
                </Typography>
              </div>
            </div>

            {successData && (
              <div className={classes.successContainer}>
                <Typography
                  variant="h6"
                  classes={{ root: classes.successLabel }}
                >
                  {messages["ApiResponse.success"]}
                </Typography>
                <Typography
                  variant="subtitle2"
                  classes={{ root: classes.successDescription }}
                >{`Request created with ID: ${
                  successData.requestId
                } at ${formatDateAndTime(
                  new Date(successData.requestDate)
                )}`}</Typography>
              </div>
            )}

            {isError && (
              <div className={classes.successContainer}>
                <Typography
                  variant="h6"
                  classes={{ root: classes.failureLabel }}
                >
                  {messages["ApiResponse.failure"]}
                </Typography>
              </div>
            )}

            <div className={classes.buttonContainer}>
              <div className={classes.resetButtonContainer}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleResetClick}
                >
                  {messages["Button.reset"]}
                </Button>
              </div>
              <div className={classes.submitButtonContainer}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitClick}
                >
                  {messages["Button.submit"]}
                </Button>
              </div>
            </div>
          </div>
        </Paper>
      </main>
    </div>
  );
}

export default App;
