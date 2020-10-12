import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";
import LoadingIcon from "./loading2.svg";
import Spinner from "./Spinner.svg";
import Checkbox from "@material-ui/core/Checkbox";
import JobViewDetail from "./JobViewDetail";

export default () => {
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState("");
  const [loaading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [jobViewLink, setJobViewLink] = useState("");
  const [jobDetails, setJobDetails] = useState("");
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    getData(selected);
  }, [selected, checked]);

  useEffect(() => {
    getJobDetail(jobViewLink);
  }, [jobViewLink]);

  const handleJobSeach = async (e) => {
    setSelected(e.target.value);
  };

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const getJobDetail = async (value) => {
    setSpinner(true);
    if (value !== "") {
      const list = await axios(`http://localhost:8789/positions/detail/`, {
        params: { link: value },
      });
      setJobDetails(list.data);
    } else {
      setJobDetails("");
    }
    setSpinner(false);
  };

  const getData = async (value) => {
    setLoading(true);
    if (value !== "") {
      const list = await axios(`http://localhost:8789/positions/`, {
        params: { search: value, salary: checked },
      });
      setJobs(list.data);
    } else {
      setJobDetails("");
      setJobs([]);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="job-search-form">
        <div className="job-search-form-select">
          <select
            className="job-search-select"
            onChange={(e) => {
              handleJobSeach(e);
            }}
            value={selected}
          >
            <option value="">Olá Marcelo! Quais vagas você procura?</option>
            <option value="R">React</option>
            <option value="JS">JavaScript</option>
            <option value="RN">React Native</option>
            <option value="NJ">Node + Java</option>
            <option value="NJS">Node js</option>
            <option value="TS">TypeScript</option>
            <option value="J">Java</option>
            <option value="SB">Spring boot</option>
            <option value="EN">Inglês Fluente</option>
            <option value="FT">Flutter</option>
          </select>
        </div>
        <div className="job-search-form-filter">
          <Checkbox
            checked={checked}
            onChange={handleChange}
            size="medium"
            color="default"
          />
          <label>Só vagas com salário</label>
        </div>
      </div>
      {jobs.length > 0 && (
        <div className="job-search-total">
          Existem hoje{" "}
          <span className="job-search-total-jobs">{jobs.length}</span> vagas
          para você Marcelo! Aproveite!
        </div>
      )}
      <div className="jobs-body">
        <div className="jobs">
          {jobs.map((item, key) => {
            return (
              <JobViewDetail key={key} item={item} onClick={setJobViewLink} />
            );
          })}
        </div>
        <div className="frame-job-view-info">
          {jobs.length > 0 && (
            <div className="frame-job-view">
              {jobDetails !== "" ? (
                <div className="frame-job-view-detail">
                  {spinner ? (
                    <Spinner />
                  ) : (
                    <div className="frame-job-view-detail-text">
                      {jobDetails}
                    </div>
                  )}
                </div>
              ) : (
                <div className="frame-job-view-detail-empty">
                  {spinner ? (
                    <Spinner />
                  ) : (
                    <div className="frame-job-view-detail-text">
                      Selecione uma vaga para detalhes
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {loaading && (
        <div className="jobs-icon">
          <LoadingIcon></LoadingIcon>
        </div>
      )}
    </div>
  );
};
