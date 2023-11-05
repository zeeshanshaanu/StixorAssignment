"use client";
import { useState, useEffect, useRef, Fragment } from "react";
import GoogleMapReact from "google-map-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

import axios from "axios";
import {
  Card,
  Tooltip,
  Typography,
  CardContent,
  Box,
  Modal,
  Menu,
  MenuItem,
  FormControlLabel,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Paper,
  styled,
  TableCell,
  tableCellClasses,
  SwitchProps,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//////////////////      CUSTOM IMPORTS              ////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
import Event from "../../../public/Interface/eventType";
import Loader from "../Loader/Loader";
import NoData from "../noData/NoData";

////////////////////////////////////////////////////////////////
//////////////////      API SECKRET_KEY AND ENDPOINT    ////////
////////////////////////////////////////////////////////////////
const PredictHQ_API_KEY = "rREx_63whcG4bLGMSG-xtYZsgNDuo39NecXDn6ki";
const API_BASE_URL = "https://api.predicthq.com/v1/events/";

//////////////////////////  Location  ///////////////////////////
//////////////////////////  Location  ///////////////////////////
const AnyReactComponent = ({
  icon,
}: {
  lat: number | String;
  lng: number | String;
  icon: React.ReactNode;
}) => <div>{icon}</div>;

//////////////////////////  MUI-SWITCH STYLED  ///////////////////////////
//////////////////////////  MUI-SWITCH STYLED  ///////////////////////////
const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

//////////////////////////  MUI-TABLE STYLED  ///////////////////////////
//////////////////////////  MUI-TABLE STYLED  ///////////////////////////
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

//////////////////////////  CUSTOM STYLING  ///////////////////////////
//////////////////////////  CUSTOM STYLING  ///////////////////////////

const style = {
  position: "absolute" as "absolute",
  top: "60%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: ".5px solid #000",
  borderRadius: 3,
  boxShadow: 24,
  p: 2,
};

//////////////////////////  MAIN- EVENT FUNCTION START  ///////////////////////////
//////////////////////////  MAIN- EVENT FUNCTION START  ///////////////////////////
const Events = () => {
  ////////////////////////// HOOKS FOR HANDLING   ///////////////////////////
  ////////////////////////// HOOKS FOR HANDLING   ///////////////////////////
  const [events, setEvents] = useState<Event[]>([]); // Specify the Event type
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [Categ, setCateg] = useState<string | null>(null);
  const [SortData, setSortData] = useState<string | null>(null);
  const [ShowGridView, setShowGridView] = useState(false);
  const [openModel, setOpenModel] = useState(false);

  ////////////////////////// SCROLL ANIMATIONS  ///////////////////////////
  ////////////////////////// SCROLL ANIMATIONS  ///////////////////////////
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["2 1", "0 1"],
    layoutEffect: false, // Use this option
  });
  const scaleProgess = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgess = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  ////////////////////////// FILTERS FUNCTIONALITY   ///////////////////////////
  ////////////////////////// FILTERS FUNCTIONALITY   ///////////////////////////
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorE2(null);
    setOpenModel(false);
  };

  ////////////////////////// SORTING FUNCTIONALITY   ///////////////////////////
  ////////////////////////// SORTING FUNCTIONALITY   ///////////////////////////
  const [anchorE2, setAnchorE2] = useState<null | HTMLElement>(null);
  const open2 = Boolean(anchorE2);
  const handleClick2 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorE2(event.currentTarget);
  };

  ////////////////////////// MODEL DATA HANDLEING   ///////////////////////////
  ////////////////////////// MODEL DATA HANDLEING   ///////////////////////////
  const [EventDetail, setEventDetail] = useState({
    Title: "",
    Start: "",
    End: "",
    LocationLat: "",
    LocationLng: "",
    entities: [],
    labels: [],
    Desc: "",
    Category: "",
    country: "",
    scope: "",
    state: "",
    timezone: "",
    private: "",
  });

  ////////////////////////// FETCH-API CALLING USING PROMISES   ///////////////////////////
  ////////////////////////// FETCH-API CALLING USING PROMISES   ///////////////////////////
  ////////////////////////// FETCH-API CALLING USING PROMISES   ///////////////////////////

  useEffect(() => {
    fetchData();
  }, [Categ, SortData]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_BASE_URL, {
        params: {
          category: Categ,
          sort: SortData,
          limit: 15,
        },
        headers: {
          Authorization: `Bearer ${PredictHQ_API_KEY}`,
        },
      });
      setEvents(response?.data?.results);
      setLoading(false);
      console.log(response?.data);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <div className="CenterDiv">
          <NoData />
        </div>
      </>
    );
  }

  return (
    <div>
      <div className="flex justify-end gap-5">
        {/* ////////////////////////// FILTERS   /////////////////////////// */}
        {/* ////////////////////////// FILTERS   /////////////////////////// */}
        <div className="filters">
          <Tooltip placement="top" title="Filters">
            <span
              className="cursor-pointer"
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <Image
                src="/Assets/Icons/FilterIcon.png"
                alt="Description"
                width={45}
                height={45}
                layout="intrinsic"
              />
            </span>
          </Tooltip>

          <Menu
            className="h-[300px]"
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={() => {
                setCateg("school-holidays");
                setAnchorEl(null);
              }}
            >
              School Holidays
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                setCateg("public-holidays");
              }}
            >
              Public Holidays
            </MenuItem>
            <MenuItem
              onClick={() => {
                setCateg("observances");
                setAnchorEl(null);
              }}
            >
              Observances
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                setCateg("politics");
              }}
            >
              Politics
            </MenuItem>
            <MenuItem
              onClick={() => {
                setCateg("conferences");
                setAnchorEl(null);
              }}
            >
              Conferences
            </MenuItem>
            <MenuItem
              onClick={() => {
                setCateg("expos");
                setAnchorEl(null);
              }}
            >
              Expos
            </MenuItem>
            <MenuItem
              onClick={() => {
                setCateg("concerts");
                setAnchorEl(null);
              }}
            >
              Concerts
            </MenuItem>
          </Menu>
        </div>
        {/* ////////////////////////// SORTING   /////////////////////////// */}
        {/* ////////////////////////// SORTING   /////////////////////////// */}
        <div className="sorting">
          <Tooltip placement="top" title="Sorting">
            <span
              className="cursor-pointer"
              id="basic-button2"
              aria-controls={open2 ? "basic-menu2" : undefined}
              aria-haspopup="true"
              aria-expanded={open2 ? "true" : undefined}
              onClick={handleClick2}
            >
              <Image
                src="/Assets/Icons/SortIconBtn.png"
                alt="Description"
                width={50}
                height={50}
                layout="intrinsic"
              />
            </span>
          </Tooltip>

          <Menu
            className="h-[300px]"
            id="basic-menu2"
            anchorEl={anchorE2}
            open={open2}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button2",
            }}
          >
            <MenuItem
              onClick={() => {
                setSortData("title");
                setAnchorE2(null);
              }}
            >
              Title
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorE2(null);
                setSortData("start");
              }}
            >
              Start date
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSortData("end");
                setAnchorE2(null);
              }}
            >
              End date
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAnchorE2(null);
                setSortData("category");
              }}
            >
              Category
            </MenuItem>
          </Menu>
        </div>
        {/* ////////////////////////// GRID/LIST-VIEW SWITCH BUTTON   /////////////////////////// */}
        {/* ////////////////////////// GRID/LIST-VIEW SWITCH BUTTON   /////////////////////////// */}
        <div className="grid/list-View">
          <span className="mr-[10px]">List</span>
          <FormControlLabel
            onClick={() => {
              setShowGridView(!ShowGridView);
            }}
            control={<IOSSwitch sx={{ m: 1 }} />}
            label="Grid"
          />
        </div>
      </div>

      {ShowGridView ? (
        <Fragment>
          {/* ////////////////////////// GRID VIEW UI  /////////////////////////// */}
          {/* ////////////////////////// GRID VIEW UI  /////////////////////////// */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1 gap-5 cursor-pointer">
            {events?.map((event, id) => (
              <motion.div
                key={id}
                ref={ref}
                style={{
                  scale: scaleProgess,
                  opacity: opacityProgess,
                }}
              >
                <Card
                  className="hover:bg-[#E5E5E5] transition-all"
                  onClick={() => {
                    setEventDetail({
                      Title: event?.title,
                      Start: event?.start,
                      End: event?.end,
                      LocationLat: event?.location[1],
                      LocationLng: event?.location[0],
                      entities: event?.entities,
                      labels: event?.labels,
                      Desc: event?.description,
                      Category: event?.category,
                      country: event?.country,
                      scope: event?.scope,
                      state: event?.state,
                      timezone: event?.timezone,
                      private: event?.private,
                    });

                    setOpenModel(true);
                  }}
                >
                  <CardContent>
                    <div className="flex justify-between mb-1">
                      <Typography className="my-auto font-medium">
                        Title:
                      </Typography>
                      <Tooltip placement="top" title={event?.title}>
                        <Typography className="text-[#94A0B4] my-auto truncate">
                          {event?.title || "N/A"}
                        </Typography>
                      </Tooltip>
                    </div>
                    <div className="flex justify-between mb-1">
                      <Typography className="my-auto font-medium ">
                        Category:
                      </Typography>
                      <Typography className="text-[#94A0B4] my-auto bg-gray-100 py-1 px-2 rounded-[5px]">
                        {event?.category || "N/A"}
                      </Typography>
                    </div>
                    <div className="flex justify-between mb-1">
                      <Typography className="my-auto font-medium">
                        Start date:
                      </Typography>
                      <Typography className="text-[#94A0B4] my-auto">
                        {event?.start.slice(0, 10) || "N/A"}
                      </Typography>
                    </div>
                    <div className="flex justify-between mb-1">
                      <Typography className="my-auto font-medium">
                        End date:
                      </Typography>
                      <Typography className="text-[#94A0B4] my-auto">
                        {event?.end.slice(0, 10) || "N/A"}
                      </Typography>
                    </div>
                    <div className="flex justify-between mb-1">
                      <Typography className="my-auto font-medium">
                        Time zone:
                      </Typography>
                      <Typography className="text-[#94A0B4] my-auto">
                        {event?.timezone || "N/A"}
                      </Typography>
                    </div>

                    <Typography className="font-medium"> Address:</Typography>

                    <div
                      className="mt-5"
                      style={{
                        height: "25vh",
                        width: "100%",
                        marginTop: ".5rem",
                      }}
                    >
                      <GoogleMapReact
                        bootstrapURLKeys={{
                          key: "AIzaSyB4BKEFBO4lumLbnegBTnDPJZvaaMIFFXg",
                        }}
                        defaultCenter={{
                          lat: parseFloat(event?.location[1]),
                          lng: parseFloat(event?.location[0]),
                        }}
                        defaultZoom={11}
                      >
                        <AnyReactComponent
                          lat={event?.location[1]}
                          lng={event?.location[0]}
                          icon={<LocationOnIcon />}
                        />
                      </GoogleMapReact>
                    </div>

                    <Typography className="font-medium my-3">
                      Description:
                    </Typography>
                    <>
                      {event?.description ? (
                        <small className="pr-3 my-2 text-[#94A0B4]">
                          {event?.description.slice(0, 80)}...
                        </small>
                      ) : (
                        "N/A"
                      )}
                    </>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Fragment>
      ) : (
        <Fragment>
          {/* ////////////////////////// LIST VIEW UI  /////////////////////////// */}
          {/* ////////////////////////// LIST VIEW UI  /////////////////////////// */}
          <div className="my-5">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Title</StyledTableCell>
                    <StyledTableCell>Country</StyledTableCell>
                    <StyledTableCell>Category</StyledTableCell>
                    <StyledTableCell>Scope</StyledTableCell>
                    <StyledTableCell>Time&nbsp;zone</StyledTableCell>
                    <StyledTableCell>Start&nbsp;date</StyledTableCell>
                    <StyledTableCell>End&nbsp;date</StyledTableCell>
                    <StyledTableCell>Description</StyledTableCell>
                    <StyledTableCell>Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events?.map((row, id) => (
                    <StyledTableRow
                      key={id}
                      className="cursor-pointer hover:bg-[#E5E5E5] transition-all"
                      onClick={() => {
                        setEventDetail({
                          Title: row?.title,
                          Start: row?.start,
                          End: row?.end,
                          LocationLat: row?.location[1],
                          LocationLng: row?.location[0],
                          entities: row?.entities,
                          labels: row?.labels,
                          Desc: row?.description,
                          Category: row?.category,
                          country: row?.country,
                          scope: row?.scope,
                          state: row?.state,
                          timezone: row?.timezone,
                          private: row?.private,
                        });

                        setOpenModel(true);
                      }}
                    >
                      <StyledTableCell
                        component="th"
                        scope="row"
                        className="w-[200px]"
                      >
                        {row.title}
                      </StyledTableCell>
                      <StyledTableCell>{row.country || "N/A"}</StyledTableCell>
                      <StyledTableCell className="w-[200px]">
                        <span className="text-[#94A0B4] my-auto bg-gray-100 py-1 px-2 rounded-[5px]">
                          {row.category || "N/A"}&nbsp;
                        </span>
                      </StyledTableCell>
                      <StyledTableCell>
                        {row?.scope === "country"
                          ? "Country"
                          : row?.scope || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell>{row.timezone || "N/A"}</StyledTableCell>
                      <StyledTableCell className="w-[120px]">
                        {row?.start.slice(0, 10) || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell className="w-[120px]">
                        {row?.end.slice(0, 10) || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row?.description ? (
                          <small className="pr-3 my-2 text-[#94A0B4]">
                            {row?.description.slice(0, 50)}...
                          </small>
                        ) : (
                          "N/A"
                        )}
                      </StyledTableCell>
                      <StyledTableCell>
                        <RemoveRedEyeIcon style={{ color: "black" }} />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Fragment>
      )}

      {/* ////////////////////////// OPEN MODEL-UI   /////////////////////////// */}
      {/* ////////////////////////// OPEN MODEL-UI   /////////////////////////// */}
      <div>
        {openModel && (
          <Modal
            className="h-[600px] overflow-auto"
            open={openModel}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <CardContent>
                <div className="flex justify-between mb-1">
                  <Typography className="my-auto font-medium ">
                    Title:
                  </Typography>
                  <Typography className="text-[#94A0B4] my-auto ">
                    {EventDetail?.Title || "N/A"}
                  </Typography>
                </div>

                <div className="flex justify-between mb-1">
                  <Typography className="my-auto font-medium">
                    Labels:
                  </Typography>
                  {EventDetail?.labels?.length > 0 ? (
                    <div className=" ">
                      {EventDetail?.labels?.map((ShowLabels: string) => (
                        <span
                          className="ml-2 text-[#94A0B4] my-auto bg-gray-100 py-1 px-2 rounded-[5px]"
                          key={ShowLabels}
                        >
                          {ShowLabels}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "N/A"
                  )}
                </div>

                <div className="flex justify-between mb-1">
                  <Typography className="my-auto font-medium ">
                    Country:
                  </Typography>
                  <Typography className="text-[#94A0B4] my-auto ">
                    {EventDetail?.country || "N/A"}
                  </Typography>
                </div>
                <div className="flex justify-between mb-1">
                  <Typography className="my-auto font-medium ">
                    Category:
                  </Typography>
                  <Typography className="text-[#94A0B4] my-auto bg-gray-100 py-1 px-2 rounded-[5px]">
                    {EventDetail?.Category || "N/A"}
                  </Typography>
                </div>
                <div className="flex justify-between mb-1">
                  <Typography className="my-auto font-medium ">
                    Scope:
                  </Typography>
                  <Typography className="text-[#94A0B4] my-auto ">
                    {EventDetail?.scope === "country"
                      ? "Country"
                      : EventDetail?.scope || "N/A"}
                  </Typography>
                </div>
                <div className="flex justify-between mb-1">
                  <Typography className="my-auto font-medium ">
                    State:
                  </Typography>
                  <Typography className="text-[#94A0B4] my-auto bg-gray-100 py-1 px-2 rounded-[5px]">
                    {EventDetail?.state === "active" ? (
                      <span className="text-green-400">Active</span>
                    ) : (
                      <span className="text-red-400">Inactive</span> || "N/A"
                    )}
                  </Typography>
                </div>
                <div className="flex justify-between mb-1">
                  <Typography className="my-auto font-medium ">
                    Private:
                  </Typography>
                  <Typography className="text-[#94A0B4] my-auto bg-gray-100 py-1 px-2 rounded-[5px]">
                    {EventDetail?.private ? (
                      <span className="text-green-400">YES</span>
                    ) : (
                      <span className="text-red-400">NO</span>
                    )}
                  </Typography>
                </div>

                <div className="flex justify-between mb-1">
                  <Typography className="my-auto font-medium">
                    Entities:
                  </Typography>
                  {EventDetail?.entities?.length > 0 ? (
                    <div className="">
                      {EventDetail?.entities?.map((ShowEnteries: Event) => (
                        <span
                          className="ml-2 text-[#94A0B4] my-auto bg-gray-100 py-1 px-2 rounded-[5px]"
                          key={ShowEnteries.entity_id}
                        >
                          {ShowEnteries?.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "N/A"
                  )}
                </div>
                <div className="flex justify-between mb-1">
                  <Typography className="my-auto font-medium">
                    Start date:
                  </Typography>
                  <Typography className="text-[#94A0B4] my-auto">
                    {EventDetail?.Start.slice(0, 10) || "N/A"}
                  </Typography>
                </div>
                <div className="flex justify-between mb-1">
                  <Typography className="my-auto font-medium">
                    End date:
                  </Typography>
                  <Typography className="text-[#94A0B4] my-auto">
                    {EventDetail?.End.slice(0, 10) || "N/A"}
                  </Typography>
                </div>

                <div className="flex justify-between mb-1">
                  <Typography className="my-auto font-medium">
                    Time zone:
                  </Typography>
                  <Typography className="text-[#94A0B4] my-auto">
                    {EventDetail?.timezone || "N/A"}
                  </Typography>
                </div>

                <Typography className="font-medium"> Address:</Typography>

                <div
                  className="mt-5"
                  style={{
                    height: "20vh",
                    width: "100%",
                    marginTop: ".5rem",
                  }}
                >
                  <GoogleMapReact
                    bootstrapURLKeys={{
                      key: "AIzaSyB4BKEFBO4lumLbnegBTnDPJZvaaMIFFXg",
                    }}
                    defaultCenter={{
                      lat: parseFloat(EventDetail?.LocationLat),
                      lng: parseFloat(EventDetail?.LocationLng),
                    }}
                    defaultZoom={11}
                  >
                    <AnyReactComponent
                      lat={EventDetail?.LocationLat}
                      lng={EventDetail?.LocationLng}
                      icon={<LocationOnIcon />}
                    />
                  </GoogleMapReact>
                </div>

                <Typography className="font-medium my-1">
                  Description:
                </Typography>
                <>
                  {EventDetail.Desc ? (
                    <small className="pr-3 my-2 text-[#94A0B4]">
                      {EventDetail.Desc}
                    </small>
                  ) : (
                    "N/A"
                  )}
                </>
              </CardContent>
            </Box>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Events;
