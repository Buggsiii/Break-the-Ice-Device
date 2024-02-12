export default function Answers({
  question,
  canAnswer,
}: {
  question: any;
  canAnswer: boolean;
}) {
  return (
    <div className={`btn-wrapper ${canAnswer ? 'can-answer' : ''}`}>
      <h2 className="question">{question.key}</h2>
      <button>{question.value['ans1']}</button>
      <button>{question.value['ans2']}</button>
      <button>{question.value['ans3']}</button>
      <button>{question.value['ans4']}</button>
    </div>
  );
}
