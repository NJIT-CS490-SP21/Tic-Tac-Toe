import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

# This lets you import from the parent directory (one level up)
sys.path.append(os.path.abspath('../'))
from app import add_user
import models

KEY_INPUT = "input"
KEY_EXPECTED = "expected"

INITIAL_USERNAME = 'user1'

class AddUserTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: 'hang',
                KEY_EXPECTED: ['1','hang1','hang2','hang3','hang'],
            },
        ]
        
        self.initial_db_mock = []
        self.initial_db_mock.append(models.Player(username="1", score=100))
        self.initial_db_mock.append(models.Player(username="hang1", score=100))
        self.initial_db_mock.append(models.Player(username="hang2", score=100))
        self.initial_db_mock.append(models.Player(username="hang3", score=100))
        
    def mocked_db_session_add(self, username):
        self.initial_db_mock.append(username)
    
    def mocked_db_session_commit(self):
        pass
    
    def mocked_person_query_all(self):
        return self.initial_db_mock
    
    def test_success(self):
        for test in self.success_test_params:
            with patch('app.DB.session.add', self.mocked_db_session_add):
                with patch('app.DB.session.commit', self.mocked_db_session_commit):
                    with patch('models.Player.query') as mocked_query:
                        mocked_query.all = self.mocked_person_query_all
    
                        print(self.initial_db_mock)
                        actual_result = add_user(test[KEY_INPUT])
                        print("here")
                        print(actual_result)
                        expected_result = test[KEY_EXPECTED]
                        print(self.initial_db_mock)
                        print(expected_result)
                        
                        self.assertEqual(len(actual_result), len(expected_result))
                        self.assertEqual(actual_result[1], expected_result[1])


if __name__ == '__main__':
    unittest.main()