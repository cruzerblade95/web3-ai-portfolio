import {
  useQuery,
} from '@tanstack/react-query';

import {
  fetchAIAnalysis,
} from '../../lib/api';


interface AIInsightsProps {
  address: string;
}


function AIInsights({
  address,
}: AIInsightsProps) {
  const {
    data: analysis,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      'ai-analysis',
      address,
    ],

    queryFn: () =>
      fetchAIAnalysis(
        address,
      ),

    enabled:
      !!address,
  });


  if (isLoading) {
    return (
      <section className="chart-card ai-insights-card">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">
              AI ANALYSIS
            </p>

            <h2>
              Analyzing Portfolio
            </h2>
          </div>
        </div>

        <div className="ai-loading">
          <span className="loading-spinner">
            ◌
          </span>

          <p>
            AI is analyzing your portfolio...
          </p>
        </div>
      </section>
    );
  }


  if (isError) {
    return (
      <section className="chart-card ai-insights-card">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">
              AI ANALYSIS
            </p>

            <h2>
              AI Insights
            </h2>
          </div>
        </div>

        <p className="ai-error">
          Unable to generate AI insights
          right now.
        </p>
      </section>
    );
  }


  if (!analysis) {
    return null;
  }


  return (
    <section className="chart-card ai-insights-card">
      <div className="section-heading">
        <div>
          <p className="section-eyebrow">
            AI ANALYSIS
          </p>

          <h2>
            AI Portfolio Insights
          </h2>
        </div>

        <span
          className={
            `risk-badge ${analysis.riskLevel}`
          }
        >
          {analysis.riskLevel.toUpperCase()}
        </span>

        <span className="ai-badge">
          AI
        </span>
      </div>


      <p className="ai-summary">
        {analysis.summary}
      </p>


      <div className="ai-insights-list">
        {
          analysis.insights.map(
            (
              insight,
              index,
            ) => (
              <article
                key={
                  `${insight.title}-${index}`
                }
                className={
                  `ai-insight ${insight.severity}`
                }
              >
                <div className="ai-insight-icon">
                  {
                    getInsightIcon(
                      insight.severity,
                    )
                  }
                </div>

                <div>
                  <h3>
                    {insight.title}
                  </h3>

                  <p>
                    {
                      insight.description
                    }
                  </p>
                </div>
              </article>
            ),
          )
        }
      </div>
    </section>
  );
}


function getInsightIcon(
  severity:
    | 'info'
    | 'warning'
    | 'positive',
) {
  switch (
    severity
  ) {
    case 'warning':
      return '⚠️';

    case 'positive':
      return '✓';

    default:
      return '✦';
  }
}


export default AIInsights;