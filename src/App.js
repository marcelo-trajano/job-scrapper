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
  const [jobDetails, setJobDetails] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [searchTerms, setSearchTerms] = useState([]);
  const [selectedItem, setSelectedItem] = useState({ _id: 0 });

  useEffect(() => {
    loadSelectSearch();
  }, []);

  useEffect(() => {
    getData(selected);
  }, [selected, checked]);

  const onClickItemJobList = async (selectedItem) => {
    setSpinner(true);
    setSelectedItem(selectedItem);
    await getJobDetail(selectedItem.link);
    setSpinner(false);
  };

  const loadSelectSearch = async () => {
    const { data } = await axios(`http://localhost:8789/getAllSearchTerms`);
    setSearchTerms(data);
  };

  const getJobDetail = async (value) => {
    if (value) {
      const { data } = await axios(`http://localhost:8789/positions/detail/`, {
        params: { link: value },
      });
      setJobDetails(data);
    }
  };

  const getData = async (value) => {
    setLoading(true);
    if (value) {
      const { data } = await axios(`http://localhost:8789/positions/`, {
        params: { search: value, salary: checked },
      });
      setJobs(data);
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
              setSelected(e.target.value);
            }}
            value={selected}
          >
            <option value="">Olá Marcelo! Quais vagas você procura?</option>
            {searchTerms.map((item, key) => (
              <option key={key} value={item.code}>
                {item.label + ` (${item.numberOfJobs} vagas)`}
              </option>
            ))}
          </select>
        </div>
        <div className="job-search-form-filter">
          <Checkbox
            checked={checked}
            onChange={(event) => {
              setChecked(event.target.checked);
            }}
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
              <JobViewDetail
                key={key}
                item={item}
                active={item._id === selectedItem._id}
                onClick={() => {
                  onClickItemJobList(item);
                }}
              />
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
                    <div className="frame-job-view-detail-header-info">
                      <div className="frame-job-view-detail-info">
                        <div className="frame-job-view-detail-info-header">
                          <div className="frame-job-view-detail-info-company">
                            {selectedItem.companyName}
                          </div>
                          <div className="frame-job-view-detail-info-title">
                            {selectedItem.position}
                          </div>
                        </div>
                        <div className="frame-job-view-detail-cadastrar">
                          <a href={selectedItem.link}>
                            <input value="Candidate-se" type="submit"></input>
                          </a>
                        </div>
                      </div>
                      <div className="frame-job-view-detail-text">
                        {jobDetails}
                      </div>
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
