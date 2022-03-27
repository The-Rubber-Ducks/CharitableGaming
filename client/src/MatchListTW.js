export default function MatchList({ matches }) {
    matches.forEach(match => {
        let factor;
        (match.win) ? factor = 2 : factor = 1; 
        match.charityPoints = factor*(2*match.kills + match.assists - match.deaths)
        if (match.charityPoints < 0) match.charityPoints = 0;
    })

    const imageSize = "30px";
    return (
      <div className="bg-white shadow overflow-hidden rounded-md w-4/5">
        <ul role="list" className="divide-y divide-gray-200">
          {matches.map((match, i) => ( 
            <li key={i} className={(match.win ? "victory" : "defeat") + " px-6 py-4 flex h-24 stats"}>
              <div className="stat-container w-1/4">
                  <img 
                    src="kill.png" 
                    width={imageSize}
                    height={imageSize}
                    alt="Logo" 
                    className="stat-logo"
                  />
                  {match.kills} { (match.kills !== 1) ? "kills" : "kill"}
              </div>
              <div className="stat-container w-1/4">
                <img 
                        src="death.png" 
                        width={imageSize}
                        height={imageSize}
                        alt="Logo" 
                        className="stat-logo"
                    />
                  {match.deaths} deaths
                </div>
              <div className="stat-container w-1/4">
                <img 
                    src="assist.png" 
                    width={imageSize}
                    height={imageSize}
                    alt="Logo" 
                    className="stat-logo"
                    />
                  {match.assists} assists

              </div>
              <div className="stat-container w-1/4">+ {match.charityPoints} CP</div>
            </li>
          ))}
        </ul>
      </div>
    )
  }