"""
Unit tests for mocked cases
"""
import unittest
from unittest.mock import patch
import os
import sys

# This lets you import from the parent directory (one level up)
sys.path.append(os.path.abspath('../../'))
# pylint: disable=wrong-import-position
from app import add_user, get_user_data
# pylint: disable=wrong-import-position
import models

KEY_INPUT = "input"
KEY_EXPECTED = "expected"

INITIAL_USERNAME = 'user1'

class AddUserTestCase(unittest.TestCase):
    """Add user - mocked test case"""
    def setUp(self):
        """Set up expected results"""
        self.success_test_params = [
            {
                KEY_INPUT: 'hang',
                KEY_EXPECTED: ['1', 'hang1', 'hang2', 'hang3', 'hang'],
            },
            {
                KEY_INPUT: 'hang4',
                KEY_EXPECTED: ['1', 'hang1', 'hang2', 'hang3', 'hang', 'hang4'],
            },
            {
                KEY_INPUT: 'hang5',
                KEY_EXPECTED: ['1', 'hang1', 'hang2', 'hang3', 'hang', 'hang4', 'hang5'],
            }
        ]
        self.initial_db_mock = []
        self.initial_db_mock.append(models.Player(username="1", score=100))
        self.initial_db_mock.append(models.Player(username="hang1", score=100))
        self.initial_db_mock.append(models.Player(username="hang2", score=100))
        self.initial_db_mock.append(models.Player(username="hang3", score=100))
    def mocked_db_session_add(self, username):
        """Mock adding user to db"""
        self.initial_db_mock.append(username)
    def mocked_db_session_commit(self):
        """Mock committing query to db"""
    def mocked_person_query_all(self):
        """Mock get all users from db"""
        return self.initial_db_mock
    def test_success(self):
        """Check for expected result"""
        for test in self.success_test_params:
            with patch('app.DB.session.add', self.mocked_db_session_add):
                with patch('app.DB.session.commit', self.mocked_db_session_commit):
                    with patch('models.Player.query') as mocked_query:
                        mocked_query.all = self.mocked_person_query_all
                        print(self.initial_db_mock)
                        actual_result = add_user(test[KEY_INPUT])
                        print(actual_result)
                        expected_result = test[KEY_EXPECTED]
                        print(self.initial_db_mock)
                        print(expected_result)
                        self.assertEqual(len(actual_result), len(expected_result))
                        self.assertEqual(actual_result[1], expected_result[1])

class GetUserDataTestCase(unittest.TestCase):
    """get_user_data method - mocked test case"""
    def setUp(self):
        """Set up expected results"""
        self.success_test_params = [
            {
                KEY_INPUT: "hang1",
                KEY_EXPECTED: models.Player(username="hang1", score=109),
            },
            {
                KEY_INPUT: 'hang2',
                KEY_EXPECTED: models.Player(username="hang2", score=91),
            },
            {
                KEY_INPUT: 'hang3',
                KEY_EXPECTED: models.Player(username="hang3", score=100),
            }
        ]
    def test_success(self):
        """Check for expected result"""
        for test in self.success_test_params:
            actual_result = get_user_data(test[KEY_INPUT])
            print(actual_result)
            expected_result = test[KEY_EXPECTED]
            print(expected_result)
            self.assertEqual(actual_result.username, expected_result.username)
            self.assertEqual(actual_result.score, expected_result.score)
if __name__ == '__main__':
    unittest.main()
    