'''
    Unit tests for unmocked cases
'''

import unittest
import os
import sys
import unittest.mock as mock
from unittest.mock import patch

# This lets you import from the parent directory (one level up)
sys.path.append(os.path.abspath('../../'))
# pylint: disable=wrong-import-position
from app import update_user_list, set_game_result
# pylint: disable=wrong-import-position

USERNAME_INPUT = "username"
USERS_INPUT = 'users'
ROLE_INPUT = 'role'
EXPECTED_OUTPUT = "expected"

class UpdateUserListTestCase(unittest.TestCase):
    """Update user list - unmocked test case"""
    def setUp(self):
        """Set up expected results"""
        self.success_test_params = [
            {
                USERNAME_INPUT: "hang1",
                ROLE_INPUT : 'X',
                USERS_INPUT: {
                },
                EXPECTED_OUTPUT: {
                    'hang1': 'X'
                }
            },
            {
                USERNAME_INPUT: "hang2",
                ROLE_INPUT : 'O',
                USERS_INPUT: {
                    'hang1': 'X'
                },
                EXPECTED_OUTPUT: {
                    'hang1': 'X',
                    'hang2': 'O'
                }
            },
            {
                USERNAME_INPUT: "hang3",
                ROLE_INPUT : 'Spectator',
                USERS_INPUT: {
                    'hang1': 'X',
                    'hang2': 'O'
                },
                EXPECTED_OUTPUT: {
                    'hang1': 'X',
                    'hang2': 'O',
                    "hang3": 'Spectator'
                }
            }
        ]
    def test_update_user_list(self):
        """Check for expected result"""
        for test in self.success_test_params:
            username = test[USERNAME_INPUT]
            role = test[ROLE_INPUT]
            actual_result = update_user_list(username, role, test[USERS_INPUT])
            # Assign the expected output as a variable from test
            expected_result = test[EXPECTED_OUTPUT]
            # Use assert checks to see compare values of the results
            self.assertEqual(actual_result[username], expected_result[username])
            self.assertEqual(len(actual_result), len(expected_result))

class SetGameResultTestCase(unittest.TestCase):
    """Set username for winner and loser - unmocked test case"""
    def setUp(self):
        """Set up expected results"""
        self.success_test_params = [
            {
                USERNAME_INPUT: "hang1",
                ROLE_INPUT : 'X',
                EXPECTED_OUTPUT: {
                    'winner': 'hang1',
                    'loser': 'hang2'
                }
            },
            {
                USERNAME_INPUT: "hang3",
                ROLE_INPUT : 'O',
                EXPECTED_OUTPUT: {
                    'winner': 'hang3',
                    'loser': 'hang2'
                }
            },
            {
                USERNAME_INPUT: "hang",
                ROLE_INPUT : 'X',
                EXPECTED_OUTPUT: {
                    'winner': 'hang',
                    'loser': 'hang2'
                }
            }
        ]
    def mocked_get_user_by_value(self, value):
        """Loser will always be username hang2"""
        return "hang2"
    def test_set_game_result(self):
        """Check for expected result"""
        for test in self.success_test_params:
            #with mock.patch("app.get_user_by_value") as mocked_get_user_by_value:
            #    mocked_get_user_by_value.retun_value = "hang2"
            with patch('app.get_user_by_value', self.mocked_get_user_by_value):
                username = test[USERNAME_INPUT]
                role = test[ROLE_INPUT]
                actual_result = set_game_result(username, role)
                print(actual_result)
                # Assign the expected output as a variable from test
                expected_result = test[EXPECTED_OUTPUT]
                print(expected_result)
                # Use assert checks to see compare values of the results
                self.assertEqual(actual_result['winner'], expected_result['winner'])
                self.assertEqual(actual_result['loser'], expected_result['loser'])

if __name__ == '__main__':
    unittest.main()
    