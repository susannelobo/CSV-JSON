const pool = require('../config/db');

// Insert batch
async function insertDataBatch(batch) {
  if (batch.length === 0) return;

  const client = await pool.connect();
  try {
    const values = [];
    const queryParams = batch
      .map((row, i) => {
        const offset = i * 4;
        values.push(row.name, row.age, row.address, row.additional_info);
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`;
      })
      .join(',');

    const queryText = `
      INSERT INTO public.users (name, age, address, additional_info) 
      VALUES ${queryParams};
    `;
    await client.query(queryText, values);
    console.log(`Inserted batch of ${batch.length} records.`);
  } catch (err) {
    console.error('Error inserting batch:', err);
  } finally {
    client.release();
  }
}

// Query for age distribution
async function calculateAndPrintAgeDistribution() {
  console.log('\nCalculating Age Distribution...');
  const queryText = `
    WITH age_groups AS (
      SELECT
        CASE
          WHEN age < 20 THEN '< 20'
          WHEN age >= 20 AND age <= 40 THEN '20 to 40'
          WHEN age > 40 AND age <= 60 THEN '40 to 60'
          WHEN age > 60 THEN '> 60'
        END AS "Age-Group"
      FROM public.users
    ),
    total_users AS (SELECT COUNT(*) AS total FROM public.users)
    SELECT g."Age-Group",
           ROUND((COUNT(g."Age-Group")::decimal / t.total::decimal) * 100.0, 2) AS "% Distribution"
    FROM age_groups g, total_users t
    WHERE g."Age-Group" IS NOT NULL
    GROUP BY g."Age-Group", t.total
    ORDER BY
      CASE g."Age-Group"
        WHEN '< 20' THEN 1
        WHEN '20 to 40' THEN 2
        WHEN '40 to 60' THEN 3
        WHEN '> 60' THEN 4
      END;
  `;

  try {
    const res = await pool.query(queryText);
    const report = res.rows.map(r => ({
      'Age-Group': r['Age-Group'],
      '% Distribution': r['% Distribution'],
    }));
    console.table(report);
  } catch (err) {
    console.error('Error calculating age distribution:', err);
  }
}

module.exports = { insertDataBatch, calculateAndPrintAgeDistribution };

