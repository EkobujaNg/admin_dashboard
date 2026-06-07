import { propertyA, propertyB, propertyC } from "../../public/assets/images";

export const facilities = [
  {
    id: 1,
    name: "Wonderland Estate",
    image: propertyA,
    location: "Kwaba, FCT Abuja",
    tasks: [
      {
        id: 1,
        taskName: "Repair Door",
        assignedTo: "John Doe",
        assignedProperties: ["Wonderland Estate"],
        date: "2025-06-02T00:00:00Z",
        status: "approved",
      },
      {
        id: 2,
        taskName: "Paint the Wall",
        assignedTo: "Jane Smith",
        assignedProperties: ["Wonderland Estate"],
        date: "2025-06-03T00:00:00Z",
        status: "pending",
      },
    ],
  },
  {
    id: 2,
    name: "Suncity Estate",
    image: propertyB,
    location: "Ikeja, Lagos",
    tasks: [
      {
        id: 1,
        taskName: "Repair the Sink",
        assignedTo: "Alex Brown",
        assignedProperties: ["Suncity Estate"],
        date: "2025-06-04T00:00:00Z",
        status: "rejected",
      },
      {
        id: 2,
        taskName: "Drill a Borehole",
        assignedTo: "Mary Green",
        assignedProperties: ["Suncity Estate"],
        date: "2025-06-05T00:00:00Z",
        status: "approved",
      },
    ],
  },
  {
    id: 3,
    name: "Skyline Avenue",
    image: propertyC,
    location: "Lekki, Lagos",
    tasks: [
    //   {
    //     id: 1,
    //     taskName: "Fix Elevator",
    //     assignedTo: "Chris Blue",
    //     assignedProperties: ["Skyline Avenue"],
    //     date: "2025-06-06T00:00:00Z",
    //     status: "pending",
    //   },
    ],
  },
  {
    id: 4,
    name: "Golden Plaza",
    image: propertyA,
    location: "Victoria Island, Lagos",
    tasks: [
      {
        id: 1,
        taskName: "Replace Lighting",
        assignedTo: "Patricia Black",
        assignedProperties: ["Golden Plaza"],
        date: "2025-06-07T00:00:00Z",
        status: "approved",
      },
    ],
  },
];
