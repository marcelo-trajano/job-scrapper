import React from "react";

export default ({ onChange, selected }) => {
  return (
    <div className="job-search-form-select">
      <select
        className="job-search-select"
        onChange={(e) => {
          onChange(e);
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
  );
};
