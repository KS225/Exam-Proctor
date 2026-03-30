import { useEffect, useState } from "react";
import "../styles/participants.css";

function Participants({ code }) {

  const [teacher,setTeacher] = useState(null);
  const [students,setStudents] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{

    fetchParticipants();

  },[code]);

  const fetchParticipants = async()=>{

    try{

      const res = await fetch(
        `http://localhost:5000/api/classrooms/participants/${code}`
      );

      if(!res.ok){
        throw new Error("Failed to fetch participants");
      }

      const data = await res.json();

      setTeacher(data.teacher);
      setStudents(data.students);

      setLoading(false);

    }
    catch(err){

      console.log("Participants error:",err);
      setLoading(false);

    }

  };

  if(loading){
    return <p>Loading participants...</p>;
  }

  return(

    <div className="participants-container">

      <h2>Participants</h2>

      <div className="participant-section">

        <h3>Teacher</h3>

        {teacher && (

          <div className="participant-card">

            <div className="avatar">
              {teacher.name?.charAt(0)}
            </div>

            <div>
              <div>{teacher.name}</div>
              <small>{teacher.email}</small>
            </div>

          </div>

        )}

      </div>

      <div className="participant-section">

        <h3>
          Students ({students.length})
        </h3>

        {students.map((s)=>(

          <div
            key={s._id}
            className="participant-card"
          >

            <div className="avatar">
              {s.name?.charAt(0)}
            </div>

            <div>
              <div>{s.name}</div>
              <small>{s.email}</small>
            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Participants;