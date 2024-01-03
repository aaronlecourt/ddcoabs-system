
// ORIGINAL API from newly rebased branch
import connectMongo from "../../../../utils/connectMongo";
import Appointment from "../../../../models/Appointment";
import type { NextApiRequest, NextApiResponse } from "next";
import APPOINTMENT_STATUS from "../../../../constants/appointmentStatus";

export default async function appointmentHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectMongo();

    const { query, method, body } = req;

    switch (method) {
      case "GET":
        try {
          let appointments = [];

          if (query) {
            let appointmentQuery = {};
            const { status = "All", search, sortBy } = query;

            Object.keys(query).map(v => {
              if (v == 'status' && status) {
                // Prepare the query based on status and search parameters
                if (status === "Today") {
                  const today = new Date();
                  Object.assign(appointmentQuery, {
                    date: {
                      $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                      $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
                    },
                  })
                } else if (status !== "All") {
                  Object.assign(appointmentQuery, { status });
                }
              } else if (v == 'search' && search) {
                const searchQuery = {
                  $or: [
                    { patientName: { $regex: search, $options: "i" } },
                    { dentistService: { $regex: search, $options: "i" } },
                    // Add more fields here based on your Appointment model
                  ],
                };

                appointmentQuery = status === "All"
                  ? { ...searchQuery }
                  : { ...appointmentQuery, ...searchQuery };
              } else if (v == 'dentistService') {
                Object.assign(appointmentQuery, { [v]: { '$regex': `${query[v]}`, '$options': 'i' } })
              } else if (v != 'sortBy') {
                Object.assign(appointmentQuery, { [v]: query[v] })
              }
            })

            appointments = await Appointment.find(appointmentQuery);

            // Apply sorting based on sortBy parameter
            if (sortBy) {
              switch (sortBy) {
                case "Oldest to Latest":
                  appointments = appointments.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
                  break;
                case "Latest to Oldest":
                  appointments = appointments.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
                  break;
                case "Alphabetical (A-Z)":
                  appointments = appointments.sort((a: any, b: any) => a.dentistService.localeCompare(b.dentistService));
                  break;
                case "Alphabetical (Z-A)":
                  appointments = appointments.sort((a: any, b: any) => b.dentistService.localeCompare(a.dentistService));
                  break;
                case "Pending First":
                  appointments = appointments.sort((a: any, b: any) => {
                    if (a.status === "Pending" && b.status !== "Pending") {
                      return -1; // "Pending" appointments come first
                    } else if (a.status !== "Pending" && b.status === "Pending") {
                      return 1; // "Pending" appointments come after other statuses
                    } else {
                      return 0; // Maintain the order for other statuses
                    }
                  });
                  break;
                // Add more cases for additional sorting criteria if needed
                default:
                  break;
              }
            }
          }

          res.status(200).json(appointments);
        } catch (error) {
          console.error("Error fetching appointments:", error);
          res.status(500).json({ error: "Failed to fetch appointments" });
        }
        break;

      case "POST":
        // Validate req body
        if (!["AM", "PM"].includes(body.time)) {
          res.status(417).json("Time should be AM or PM only");
        }

        const appointmentCreated = await Appointment.create(body);
        res.status(200).json(appointmentCreated);
        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
}

// import connectMongo from "../../../../utils/connectMongo";
// import Appointment from "../../../../models/Appointment";
// import type { NextApiRequest, NextApiResponse } from "next";
// import APPOINTMENT_STATUS from "../../../../constants/appointmentStatus";

// export default async function appointmentHandler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     await connectMongo();

//     const { query, method, body } = req;

//     switch (method) {
//       case "GET":
//         try {
//           let appointments = [];
//           // let appointmentQuery = {}; // Initialize query object
//           let appointmentQuery: { date?: any, status?: any, dentistService?:any } = {};


//           if (query) {
//             const { status = "All", search, sortBy } = query;

//             // Prepare the query based on status and search parameters
//             if (status === "Today") {
//               const today = new Date();
//               appointmentQuery.date = {
//                 $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
//                 $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
//               };
//             } else if (status !== "All") {
//               appointmentQuery.status = status;
//             }

//             if (search) {
//               const searchQuery = {
//                 $or: [
//                   { patientName: { $regex: search, $options: "i" } },
//                   { dentistService: { $regex: search, $options: "i" } },
//                   // Add more fields here based on your Appointment model
//                 ],
//               };

//               appointmentQuery = status === "All"
//                 ? { ...searchQuery }
//                 : { ...appointmentQuery, ...searchQuery };
//             }

//             if (query.dentistService) {
//               appointmentQuery.dentistService = { '$regex': `${query.dentistService}`, '$options': 'i' };
//             }

//             // Do not handle sortBy within the query construction

//             appointments = await Appointment.find(appointmentQuery);

//             // Apply sorting based on sortBy parameter
//             if (sortBy) {
//               switch (sortBy) {
//                 case "Oldest to Latest":
//                   appointments = appointments.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
//                   break;
//                 case "Latest to Oldest":
//                   appointments = appointments.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
//                   break;
//                 case "Alphabetical (A-Z)":
//                   appointments = appointments.sort((a: any, b: any) => a.dentistService.localeCompare(b.dentistService));
//                   break;
//                 case "Alphabetical (Z-A)":
//                   appointments = appointments.sort((a: any, b: any) => b.dentistService.localeCompare(a.dentistService));
//                   break;
//                 case "Pending First":
//                   appointments = appointments.sort((a: any, b: any) => {
//                     if (a.status === "Pending" && b.status !== "Pending") {
//                       return -1; // "Pending" appointments come first
//                     } else if (a.status !== "Pending" && b.status === "Pending") {
//                       return 1; // "Pending" appointments come after other statuses
//                     } else {
//                       return 0; // Maintain the order for other statuses
//                     }
//                   });
//                   break;
//                 // Add more cases for additional sorting criteria if needed
//                 default:
//                   break;
//               }
//             }
//           }

//           res.status(200).json(appointments);
//         } catch (error) {
//           console.error("Error fetching appointments:", error);
//           res.status(500).json({ error: "Failed to fetch appointments" });
//         }
//         break;

//       case "POST":
//         // Validate req body
//         if (!["AM", "PM"].includes(body.time)) {
//           res.status(417).json("Time should be AM or PM only");
//         }

//         const appointmentCreated = await Appointment.create(body);
//         res.status(200).json(appointmentCreated);
//         break;

//       default:
//         res.setHeader("Allow", ["GET", "POST"]);
//         res.status(405).end(`Method ${method} Not Allowed`);
//         break;
//     }
//   } catch (error) {
//     console.error("Server error:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// }