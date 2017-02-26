from collections import defaultdict

from . import models

class GradeScoreCalculator():
    def __init__(self, user):
        self.grade_scores = models.GradeScore.objects.filter(user=user)
        self.styles = models.ClimbStyle.objects.filter(user=user)
        self.grade_score_mapping = defaultdict(float)
        self.style_mapping = defaultdict(lambda: 1.)
        self.process_grade_scores()
        self.process_styles()
    
    def process_grade_scores(self):
        for grade_score in self.grade_scores:
            self.grade_score_mapping[grade_score.grade] = grade_score.score
        
    def process_styles(self):
        for style in self.styles:
            self.style_mapping[style.style] = style.multiplier

    def get_total_score(self, grade, style):
        points = 0.
        num_grades = 0
        for exact_grade in grade.split('/'):
            try:
                points += self.grade_score_mapping[exact_grade]
            except KeyError:
                pass
            num_grades += 1
        if num_grades:
            points /= num_grades
        
        return points * self.style_mapping[style]
