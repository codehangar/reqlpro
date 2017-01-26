const Analytics = require('analytics-node');

let SegmentKey = 'lU0Oq54ABsjViXkKOcZe8YfeB18UbaNU';
if (process.env.NODE_ENV === 'development') {
  SegmentKey = 'HJNleLn4M272yzr03qefq5kGswuU1k0E';
  console.log(`USING development SEGMENT KEY`);
}

const analytics = new Analytics(SegmentKey, {
  flushAt: 1
});

// export default analytics;
module.exports = analytics;
