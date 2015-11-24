/**
 * Created by Keith Morris on 2/24/15.
 */
module.exports = {
    newsite: {
        defaults: {
            parent: '/Users/kmorris/Sites',
            webroot: '',
            index: false
        },
        vhostConfDir: '/etc/apache2/vhosts/',
        vhostTemplateFile: 'vhostTemplate.conf',
        reverseDomainFormat: true
    }
};
